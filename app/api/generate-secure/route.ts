import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  portfolioInputSchema, 
  validateRequest, 
  createSecurePrompt,
  containsInjectionAttempt,
  logSecurityEvent,
  getSafeErrorMessage,
  getSecurityHeaders,
  sanitizeInput
} from "@/lib/security-guardrails";
import { createPortfolio } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Validate request
    const requestValidation = await validateRequest(request);
    if (!requestValidation.valid) {
      return NextResponse.json(
        { error: requestValidation.error },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    // Parse and validate input
    const body = await request.json();
    
    // Check for injection attempts before validation
    const bodyString = JSON.stringify(body);
    if (containsInjectionAttempt(bodyString)) {
      logSecurityEvent({
        type: 'injection_attempt',
        identifier: request.headers.get('x-forwarded-for') || 'unknown',
        details: { attempted: bodyString.substring(0, 100) }
      });
      
      return NextResponse.json(
        { error: "Invalid input detected" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate with Zod schema
    const validatedData = portfolioInputSchema.parse(body);

    // Get session (optional - can work without auth)
    const session = await getServerSession(authOptions);

    // Create secure prompt
    const securePrompt = createSecurePrompt(validatedData);

    // Call OpenRouter API with constraints
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Portfolio Builder",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: "You are a professional portfolio content generator. Create compelling, truthful content based only on provided information. Do not invent details. Keep all content professional and appropriate for job applications."
          },
          {
            role: "user",
            content: securePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000, // Limit token generation
        stop: ["<script", "<?php", "sudo", "rm -rf"], // Stop sequences
      }),
    });

    if (!response.ok) {
      throw new Error("AI generation failed");
    }

    const result = await response.json();
    const generatedContent = result.choices[0].message.content;

    // Final content check
    if (containsInjectionAttempt(generatedContent)) {
      logSecurityEvent({
        type: 'injection_attempt',
        identifier: 'ai-response',
        details: { model: 'claude-3-haiku' }
      });
      throw new Error("Generated content failed security check");
    }

    // Generate safe portfolio code
    const portfolioCode = generateSafePortfolioCode(validatedData, generatedContent);

    // Generate URL slug
    let slug = generateSlug(validatedData.name);
    const pin = generateSecurePin();

    // Save to database
    try {
      const { slug: savedSlug, pin: savedPin } = await createPortfolio(
        { ...validatedData, generatedContent },
        pin,
        portfolioCode,
        session?.user?.email
      );
      slug = savedSlug;
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue without saving, return generated content
    }

    return NextResponse.json(
      {
        success: true,
        content: generatedContent,
        code: portfolioCode,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/p/${slug}`,
        pin: pin,
        slug: slug,
      },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error("Generation error:", error);
    
    return NextResponse.json(
      { error: getSafeErrorMessage(error) },
      { status: 400, headers: getSecurityHeaders() }
    );
  }
}

// Generate safe portfolio code without user input in dangerous places
function generateSafePortfolioCode(data: any, content: string): string {
  // Sanitize all data before including in code
  const safeName = sanitizeInput(data.name);
  const safeTitle = sanitizeInput(data.title);
  const safeContent = sanitizeInput(content);

  return `
import React from 'react';
import Head from 'next/head';

export default function Portfolio() {
  return (
    <>
      <Head>
        <title>${safeName} - ${safeTitle}</title>
        <meta name="description" content="Professional portfolio" />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">${safeName}</h1>
          <p className="text-xl text-gray-600 mt-2">${safeTitle}</p>
        </header>
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              ${safeContent.split('\n').map(line => `<p>${line}</p>`).join('\n              ')}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
`;
}

// Generate URL-safe slug
function generateSlug(name: string): string {
  const randomId = Math.random().toString(36).substring(2, 8);
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  
  return `${baseSlug}-${randomId}`;
}

// Generate secure PIN
function generateSecurePin(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Set a timeout for the API route
export const maxDuration = 30; // 30 seconds max