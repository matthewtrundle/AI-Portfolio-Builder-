import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper function to extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const buffer = await file.arrayBuffer();
  
  // For now, we'll handle text files directly
  // In production, you'd use libraries like pdf-parse for PDFs
  if (fileType === "text/plain") {
    return new TextDecoder().decode(buffer);
  }
  
  // For other formats, we'll use OpenAI to extract text
  // This is a placeholder - in production you'd use proper parsing libraries
  return "";
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated (optional for resume parsing)
    const session = await getServerSession(authOptions);
    
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF, DOC, DOCX, or TXT." },
        { status: 400 }
      );
    }

    // Extract text from file
    const fileText = await extractTextFromFile(file);
    
    // For demo purposes, we'll use file.text() for text files
    // In production, implement proper PDF/DOC parsing
    let resumeText = "";
    if (file.type === "text/plain") {
      resumeText = await file.text();
    } else {
      // For now, return a message that we need proper parsing
      return NextResponse.json({
        success: false,
        error: "PDF/DOC parsing is not yet implemented. Please use a TXT file for demo.",
        extractedData: {
          name: "",
          email: "",
          title: "",
          currentRole: "",
          experiences: [],
          skills: [],
          needsManualInput: true
        },
        confidence: 0
      });
    }

    // Use OpenAI to parse the resume text
    const prompt = `Extract the following information from this resume text. Return a JSON object with these fields:
    - name: Full name
    - email: Email address
    - title: Current or desired job title
    - location: City, State/Country
    - currentRole: Description of current role and responsibilities
    - yearsExperience: Approximate years of experience
    - keyAchievement: Most impressive achievement with metrics
    - experiences: Array of {company, role, duration, achievements: array of strings}
    - projects: Array of {name, description, technologies: array, impact}
    - technicalSkills: Array of technical skills
    - targetRoles: Array of job titles they might be targeting

    Resume text:
    ${resumeText}

    Return only valid JSON, no additional text.`;

    // Call OpenRouter API
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
            content: "You are an expert resume parser. Extract information accurately and return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      throw new Error("Failed to parse resume with AI");
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    // Parse the AI response
    let extractedData;
    try {
      extractedData = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("AI returned invalid format");
    }

    // Calculate confidence score based on how many fields were extracted
    const requiredFields = ["name", "email", "experiences"];
    const extractedFields = requiredFields.filter(field => 
      extractedData[field] && 
      (Array.isArray(extractedData[field]) ? extractedData[field].length > 0 : extractedData[field])
    );
    const confidence = extractedFields.length / requiredFields.length;

    // Add default values for missing fields
    const enrichedData = {
      name: extractedData.name || "",
      email: extractedData.email || "",
      title: extractedData.title || "Professional",
      location: extractedData.location || "",
      currentRole: extractedData.currentRole || "",
      yearsExperience: extractedData.yearsExperience || "0-2",
      keyAchievement: extractedData.keyAchievement || "",
      experiences: extractedData.experiences || [],
      projects: extractedData.projects || [],
      technicalSkills: extractedData.technicalSkills || [],
      targetRoles: extractedData.targetRoles || [],
      linkedin: "", // Will need manual input
      github: "", // Will need manual input
    };

    return NextResponse.json({
      success: true,
      extractedData: enrichedData,
      confidence,
      message: confidence < 0.8 
        ? "Some information couldn't be extracted. Please review and complete." 
        : "Resume parsed successfully!",
    });

  } catch (error) {
    console.error("Resume parsing error:", error);
    return NextResponse.json(
      { 
        error: "Failed to parse resume",
        extractedData: {
          name: "",
          email: "",
          title: "",
          currentRole: "",
          experiences: [],
          skills: [],
          needsManualInput: true
        },
        confidence: 0
      },
      { status: 500 }
    );
  }
}