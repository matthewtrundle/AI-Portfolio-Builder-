import { NextRequest, NextResponse } from "next/server";
import { 
  validateRequest,
  validateFileUpload,
  checkRateLimit,
  logSecurityEvent,
  getSafeErrorMessage,
  getSecurityHeaders,
  containsInjectionAttempt,
  containsSensitiveInfo,
  sanitizeInput
} from "@/lib/security-guardrails";
import pdf from "pdf-parse";
import mammoth from "mammoth";

// Helper function to check file signatures
function isValidFileSignature(buffer: ArrayBuffer, fileName: string): boolean {
  const bytes = new Uint8Array(buffer);
  const ext = fileName.toLowerCase().split('.').pop();
  
  // Check file signatures (magic numbers)
  const signatures: Record<string, number[][]> = {
    'pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
    'doc': [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]], // MS Office
    'docx': [[0x50, 0x4B, 0x03, 0x04]], // ZIP format (docx is a zip)
    'txt': [[]] // Text files don't have a signature
  };
  
  if (!signatures[ext!]) return false;
  if (ext === 'txt') return true; // Text files are always valid
  
  // Check if file starts with expected bytes
  return signatures[ext!].some(signature => 
    signature.every((byte, index) => bytes[index] === byte)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting specifically for file uploads
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`upload-${ip}`, parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || "5"), parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000")); // Configurable upload limit
    
    if (!rateLimit.allowed) {
      logSecurityEvent({
        type: 'rate_limit',
        identifier: ip,
        details: { endpoint: 'parse-resume' }
      });
      
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds` },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    // Validate request
    const requestValidation = await validateRequest(request);
    if (!requestValidation.valid) {
      return NextResponse.json(
        { error: requestValidation.error },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const formData = await request.formData();
    const file = formData.get("resume") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate file
    const fileValidation = validateFileUpload(file);
    if (!fileValidation.valid) {
      logSecurityEvent({
        type: 'file_rejected',
        identifier: ip,
        details: { 
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          reason: fileValidation.error
        }
      });
      
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Additional security: Check file signature
    const buffer = await file.arrayBuffer();
    if (!isValidFileSignature(buffer, file.name)) {
      logSecurityEvent({
        type: 'file_rejected',
        identifier: ip,
        details: { 
          fileName: file.name,
          reason: 'Invalid file signature'
        }
      });
      
      return NextResponse.json(
        { error: "File appears to be corrupted or invalid" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Extract text based on file type
    let resumeText = "";
    if (file.type === "text/plain") {
      resumeText = await file.text();
      
      // Check for suspicious content
      if (containsInjectionAttempt(resumeText)) {
        logSecurityEvent({
          type: 'injection_attempt',
          identifier: ip,
          details: { source: 'resume_upload' }
        });
        
        return NextResponse.json(
          { error: "Invalid content detected in resume" },
          { status: 400, headers: getSecurityHeaders() }
        );
      }
      
      // Check for sensitive information
      if (containsSensitiveInfo(resumeText)) {
        return NextResponse.json(
          { 
            error: "Please remove sensitive information (SSN, credit card numbers) from your resume",
            extractedData: getEmptyData(),
            confidence: 0
          },
          { status: 200, headers: getSecurityHeaders() }
        );
      }
      
      // Sanitize the text
      resumeText = sanitizeInput(resumeText);
      
      // Limit text length to prevent abuse
      if (resumeText.length > 50000) {
        resumeText = resumeText.substring(0, 50000);
      }
    } else {
      // For other file types, return a message about implementation
      return NextResponse.json({
        success: false,
        error: "PDF/DOC parsing coming soon. Please use a TXT file for now.",
        extractedData: getEmptyData(),
        confidence: 0
      }, { headers: getSecurityHeaders() });
    }

    // Create secure prompt for parsing
    const prompt = `Parse this resume and extract ONLY factual information. 
Do not generate or infer any information not explicitly stated.
Extract: name, email, title, location, current role description, years of experience, key achievement, job experiences, projects, skills, and potential target roles.

Important:
- Only extract what is explicitly written
- Do not include any personal information like SSN, passport numbers, or financial data
- Keep all content professional and appropriate

Resume text:
${resumeText.substring(0, 10000)} // Limit context to prevent token abuse

Return ONLY a JSON object with the extracted fields. No additional text.`;

    // Call OpenRouter API with constraints
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Portfolio Builder - Resume Parser",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: "You are a resume parser. Extract only factual information. Never generate or infer details. Return only valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent parsing
        max_tokens: 2000,
        stop: ["<script", "<?php", "Human:", "Assistant:"],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to parse resume with AI");
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    // Parse and validate the AI response
    let extractedData;
    try {
      extractedData = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("AI returned invalid format");
    }

    // Sanitize all extracted data
    const sanitizedData = sanitizeExtractedData(extractedData);

    // Calculate confidence
    const confidence = calculateConfidence(sanitizedData);

    return NextResponse.json({
      success: true,
      extractedData: sanitizedData,
      confidence,
      message: confidence < 0.8 
        ? "Some information couldn't be extracted. Please review and complete." 
        : "Resume parsed successfully!",
    }, { headers: getSecurityHeaders() });

  } catch (error) {
    console.error("Resume parsing error:", error);
    
    return NextResponse.json(
      { 
        error: getSafeErrorMessage(error),
        extractedData: getEmptyData(),
        confidence: 0
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// Sanitize extracted data
function sanitizeExtractedData(data: any): any {
  const sanitized: any = {};
  
  // Sanitize string fields
  const stringFields = ['name', 'email', 'title', 'location', 'currentRole', 
                       'yearsExperience', 'keyAchievement', 'uniqueValue'];
  
  for (const field of stringFields) {
    if (data[field] && typeof data[field] === 'string') {
      sanitized[field] = sanitizeInput(data[field]).substring(0, 1000);
    } else {
      sanitized[field] = '';
    }
  }
  
  // Sanitize arrays
  if (Array.isArray(data.experiences)) {
    sanitized.experiences = data.experiences.slice(0, 10).map((exp: any) => ({
      company: sanitizeInput(exp.company || '').substring(0, 100),
      role: sanitizeInput(exp.role || '').substring(0, 100),
      duration: sanitizeInput(exp.duration || '').substring(0, 50),
      achievements: Array.isArray(exp.achievements) 
        ? exp.achievements.slice(0, 5).map((a: string) => sanitizeInput(a).substring(0, 300))
        : []
    }));
  } else {
    sanitized.experiences = [];
  }
  
  // Sanitize other arrays
  const arrayFields = ['projects', 'technicalSkills', 'targetRoles'];
  for (const field of arrayFields) {
    if (Array.isArray(data[field])) {
      sanitized[field] = data[field].slice(0, 20).map((item: any) => 
        typeof item === 'string' ? sanitizeInput(item).substring(0, 200) : ''
      );
    } else {
      sanitized[field] = [];
    }
  }
  
  return sanitized;
}

// Calculate confidence score
function calculateConfidence(data: any): number {
  const requiredFields = ['name', 'email', 'experiences'];
  const importantFields = ['title', 'currentRole', 'technicalSkills'];
  
  let score = 0;
  let total = 0;
  
  // Check required fields (weight: 2)
  for (const field of requiredFields) {
    total += 2;
    if (data[field] && (Array.isArray(data[field]) ? data[field].length > 0 : data[field])) {
      score += 2;
    }
  }
  
  // Check important fields (weight: 1)
  for (const field of importantFields) {
    total += 1;
    if (data[field] && (Array.isArray(data[field]) ? data[field].length > 0 : data[field])) {
      score += 1;
    }
  }
  
  return score / total;
}

// Get empty data structure
function getEmptyData() {
  return {
    name: "",
    email: "",
    title: "",
    location: "",
    currentRole: "",
    yearsExperience: "0-2",
    keyAchievement: "",
    experiences: [],
    projects: [],
    technicalSkills: [],
    targetRoles: [],
    linkedin: "",
    github: "",
  };
}

// Set a timeout for the API route
export const maxDuration = 30; // 30 seconds max