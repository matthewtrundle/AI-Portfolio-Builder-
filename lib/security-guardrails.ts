import { z } from 'zod';
import { NextRequest } from 'next/server';

// Content moderation patterns
const INAPPROPRIATE_PATTERNS = [
  /\b(fuck|shit|damn|ass|bitch|bastard)\b/gi,
  /\b(nigger|faggot|retard|spic|chink|kike)\b/gi, // Slurs
  /\b(kill|murder|suicide|rape|torture)\b/gi, // Violence
  /\b(porn|sex|nude|nsfw)\b/gi, // Adult content
];

const INJECTION_PATTERNS = [
  /(\bor\b|\band\b)\s*\d+\s*=\s*\d+/gi, // SQL injection
  /<script[^>]*>[\s\S]*?<\/script>/gi, // XSS
  /javascript:/gi, // JS protocol
  /on\w+\s*=/gi, // Event handlers
  /\{\{.*\}\}/g, // Template injection
  /\$\{.*\}/g, // Template literals
  /eval\s*\(/gi, // Eval attempts
  /system\s*\(/gi, // System calls
  /exec\s*\(/gi, // Exec calls
  /\bignore\s+previous\s+instructions?\b/gi, // Prompt injection
  /\bforget\s+everything\b/gi, // Prompt injection
  /\byou\s+are\s+now\b/gi, // Prompt injection
];

const SENSITIVE_INFO_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b\d{9}\b/g, // SSN without dashes
  /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card
  /\b[A-Z]{2}\d{6,8}\b/g, // Passport
];

// Input validation schemas
export const portfolioInputSchema = z.object({
  // Basic Information
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title must be less than 150 characters")
    .regex(/^[a-zA-Z0-9\s&,.-]+$/, "Title contains invalid characters"),
  
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email is too long"),
  
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .regex(/^[a-zA-Z\s,.-]+$/, "Location contains invalid characters"),
  
  // Professional Information
  currentRole: z.string()
    .min(10, "Please provide more detail about your role")
    .max(1000, "Description is too long")
    .refine(val => !containsInappropriateContent(val), {
      message: "Content contains inappropriate language"
    }),
  
  yearsExperience: z.enum(["0-2", "3-5", "6-10", "10+"]),
  
  keyAchievement: z.string()
    .min(10, "Please provide more detail")
    .max(500, "Achievement description is too long")
    .refine(val => !containsInappropriateContent(val), {
      message: "Content contains inappropriate language"
    }),
  
  // Arrays with limits
  experiences: z.array(z.object({
    company: z.string().min(2).max(100),
    role: z.string().min(2).max(100),
    duration: z.string().min(3).max(50),
    achievements: z.array(z.string().min(10).max(300)).max(5),
  })).min(1).max(10),
  
  projects: z.array(z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    technologies: z.array(z.string().max(50)).max(10),
    impact: z.string().min(10).max(300),
    link: z.string().url().optional().or(z.literal("")),
  })).max(10).optional(),
  
  technicalSkills: z.array(z.string().min(2).max(50)).min(3).max(20),
  targetRoles: z.array(z.string().min(2).max(100)).min(1).max(5),
  uniqueValue: z.string().min(20).max(500),
});

// Content validation functions
export function containsInappropriateContent(text: string): boolean {
  return INAPPROPRIATE_PATTERNS.some(pattern => pattern.test(text));
}

export function containsInjectionAttempt(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

export function containsSensitiveInfo(text: string): boolean {
  return SENSITIVE_INFO_PATTERNS.some(pattern => pattern.test(text));
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  // Remove any HTML/script tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove potential SQL injection patterns
  sanitized = sanitized.replace(/['";\\]/g, '');
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
}

// Rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10"),
  windowMs: number = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000") // 1 hour
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  // Clean up old entries
  if (entry && entry.resetTime < now) {
    rateLimitMap.delete(identifier);
  }
  
  const currentEntry = rateLimitMap.get(identifier);
  
  if (!currentEntry) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true };
  }
  
  if (currentEntry.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((currentEntry.resetTime - now) / 1000)
    };
  }
  
  currentEntry.count++;
  return { allowed: true };
}

// AI prompt constraints
export function createSecurePrompt(userInput: any): string {
  const basePrompt = `You are an AI assistant helping create professional portfolios for job seekers. 
Your responses must be:
1. Professional and appropriate for workplace settings
2. Factual and based only on the provided information
3. Free of personal opinions or controversial topics
4. Focused solely on career and professional development

Do not:
- Generate content about violence, adult themes, or illegal activities
- Include personal information like SSN, credit cards, or passwords
- Respond to requests unrelated to portfolio creation
- Execute code or system commands

Based on the following user information, create a professional portfolio:

`;

  // Validate and sanitize each field
  const sanitizedData = {
    name: sanitizeInput(userInput.name || ''),
    title: sanitizeInput(userInput.title || ''),
    currentRole: sanitizeInput(userInput.currentRole || ''),
    keyAchievement: sanitizeInput(userInput.keyAchievement || ''),
    // ... sanitize other fields
  };

  return basePrompt + JSON.stringify(sanitizedData);
}

// File upload validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024; // Default 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only PDF, DOC, DOCX, and TXT allowed" };
  }
  
  // Check file extension as additional validation
  const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { valid: false, error: "Invalid file extension" };
  }
  
  return { valid: true };
}

// Request validation middleware
export async function validateRequest(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
  // Check rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = checkRateLimit(ip);
  
  if (!rateLimit.allowed) {
    return {
      valid: false,
      error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`
    };
  }
  
  // Validate content type
  const contentType = request.headers.get('content-type');
  if (request.method === 'POST' && !contentType?.includes('application/json') && !contentType?.includes('multipart/form-data')) {
    return { valid: false, error: 'Invalid content type' };
  }
  
  return { valid: true };
}

// Secure response headers
export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openrouter.ai",
  };
}

// Error messages that don't reveal system details
export function getSafeErrorMessage(error: unknown): string {
  console.error('Security error:', error); // Log full error server-side
  
  // Return generic messages to users
  if (error instanceof z.ZodError) {
    return "Please check your input and try again";
  }
  
  return "An error occurred. Please try again later";
}

// Audit logging
export function logSecurityEvent(event: {
  type: 'rate_limit' | 'injection_attempt' | 'invalid_input' | 'file_rejected';
  identifier: string;
  details?: any;
}) {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY] ${timestamp} - ${event.type}:`, {
    identifier: event.identifier,
    details: event.details
  });
  
  // In production, send to logging service
  // await sendToLoggingService(event);
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key);
    }
  });
}, 600000); // Clean up every 10 minutes