import { NextRequest, NextResponse } from "next/server";
import { createPortfolio } from "@/lib/db";

// Simple in-memory rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = parseInt(process.env.RATE_LIMIT_PER_HOUR || "10");
  const window = 60 * 60 * 1000; // 1 hour

  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.title || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    // Prepare the prompt for AI generation
    const prompt = `Create a professional portfolio website content for:
    
Name: ${data.name}
Title: ${data.title}
Location: ${data.location}
Years of Experience: ${data.yearsExperience}
Current Role: ${data.currentRole}
Key Achievement: ${data.keyAchievement}
Target Roles: ${data.targetRoles.join(", ")}
Unique Value: ${data.uniqueValue}

Experience:
${data.experiences
  .map(
    (exp: any) => `
- ${exp.role} at ${exp.company} (${exp.duration})
  Achievements: ${exp.achievements.join("; ")}
`
  )
  .join("")}

Projects:
${
  data.projects
    ?.map(
      (proj: any) => `
- ${proj.name}: ${proj.description}
  Technologies: ${proj.technologies.join(", ")}
  Impact: ${proj.impact}
`
    )
    .join("") || "No projects listed"
}

Technical Skills: ${data.technicalSkills.join(", ")}

Generate compelling, professional content for a modern portfolio website that:
1. Highlights technical expertise and leadership
2. Quantifies impact with metrics
3. Tells a cohesive career story
4. Positions for target roles
5. Differentiates from other candidates

Return a JSON object with sections: hero, about, experience, projects, skills, and contact.`;

    // Call OpenRouter API
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
            content:
              "You are an expert portfolio content writer specializing in tech resumes. Generate compelling, ATS-friendly content that showcases achievements with specific metrics.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 }
      );
    }

    const result = await response.json();
    const generatedContent = result.choices[0].message.content;

    // Parse the generated content (assuming it returns JSON)
    let portfolioContent;
    try {
      portfolioContent = JSON.parse(generatedContent);
    } catch (e) {
      // If not JSON, structure it ourselves
      portfolioContent = {
        hero: {
          headline: `${data.name} - ${data.title}`,
          subheading: data.currentRole,
          cta: "View My Work",
        },
        about: {
          summary: generatedContent,
          keyAchievement: data.keyAchievement,
        },
        experience: data.experiences,
        projects: data.projects || [],
        skills: data.technicalSkills,
        contact: {
          email: data.email,
          linkedin: data.linkedin,
          github: data.github,
        },
      };
    }

    // Generate the actual portfolio code
    const portfolioCode = generatePortfolioCode(data, portfolioContent);

    // Generate a 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to database
    try {
      const { slug } = await createPortfolio(
        { ...data, generatedContent: portfolioContent },
        pin,
        portfolioCode
      );

      return NextResponse.json({
        success: true,
        content: portfolioContent,
        code: portfolioCode,
        slug,
        pin,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/p/${slug}`,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Still return the generated content even if DB fails
      return NextResponse.json({
        success: true,
        content: portfolioContent,
        code: portfolioCode,
        error: "Could not save portfolio, but generation successful",
      });
    }
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generatePortfolioCode(userData: any, content: any): string {
  // This would generate the full Next.js portfolio code
  // For now, returning a template
  return `// Generated Portfolio for ${userData.name}
import React from 'react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4"
        >
          ${userData.name}
        </motion.h1>
        <p className="text-2xl text-gray-600">
          ${userData.title}
        </p>
      </header>
      
      {/* Add more sections here */}
    </div>
  );
}`;
}