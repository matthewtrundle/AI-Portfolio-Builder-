# AI Portfolio Builder Security Implementation Guide

## Overview

This guide provides comprehensive security guardrails for the AI Portfolio Builder application, covering input validation, content moderation, rate limiting, and protection against common attacks.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Input Validation](#input-validation)
3. [Content Moderation](#content-moderation)
4. [Rate Limiting](#rate-limiting)
5. [File Upload Security](#file-upload-security)
6. [AI Prompt Security](#ai-prompt-security)
7. [CSRF Protection](#csrf-protection)
8. [Client-Side Security](#client-side-security)
9. [Security Headers](#security-headers)
10. [Monitoring and Logging](#monitoring-and-logging)

## Quick Start

### 1. Update your API routes to use secure versions:

```typescript
// Replace /api/generate with /api/generate-secure
// Replace /api/parse-resume with /api/parse-resume-secure
```

### 2. Add CSRF protection to your layout:

```typescript
// app/layout.tsx
import { setCSRFCookie } from "@/lib/csrf-protection";

export default async function RootLayout({ children }) {
  const csrfToken = await setCSRFCookie();
  
  return (
    <html>
      <head>
        <meta name="csrf-token" content={csrfToken} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Update client-side forms:

```typescript
// Use fetchWithCSRF instead of fetch
import { fetchWithCSRF } from "@/lib/csrf-protection";

const response = await fetchWithCSRF("/api/generate-secure", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

## Input Validation

### Server-Side Validation

All user inputs are validated using Zod schemas with strict constraints:

```typescript
// Character limits
- Name: 100 characters
- Title: 200 characters
- Short text: 500 characters
- Medium text: 1000 characters
- Long text: 2000 characters
- Max experiences: 10
- Max projects: 20
- Max skills: 50
```

### Client-Side Validation

Use the provided validation utilities for real-time feedback:

```typescript
import { ClientValidation, DebouncedValidator } from "@/lib/client-security";

const validator = new DebouncedValidator();

// In your input handler
const handleInputChange = (field: string, value: string) => {
  validator.validate(
    field,
    value,
    (val) => ClientValidation.validateTextInput(val, 500),
    (result) => {
      if (!result.valid) {
        setError(field, result.error);
      } else {
        clearError(field);
      }
    }
  );
};
```

## Content Moderation

The system automatically scans for:

1. **Inappropriate Content**
   - Profanity and offensive language
   - Personal sensitive information (SSN, passport numbers)
   - Financial information

2. **Injection Attempts**
   - Prompt injection patterns
   - SQL injection patterns
   - XSS attempts

3. **Implementation**:

```typescript
// Content is automatically checked during validation
const validated = securePortfolioSchema.parse(data);
// If content contains inappropriate material, validation will fail
```

## Rate Limiting

### Configuration

Rate limits are enforced per IP address:

- **API Generation**: 10 requests per hour
- **File Upload**: 5 requests per hour

### Customization

Update rate limits via environment variables:

```env
RATE_LIMIT_PER_HOUR=10
UPLOAD_RATE_LIMIT_PER_HOUR=5
```

### Response Headers

Rate-limited responses include:
- `429 Too Many Requests` status
- `Retry-After` header indicating when to retry

## File Upload Security

### Validation Steps

1. **File Size**: Maximum 10MB
2. **File Types**: PDF, DOC, DOCX, TXT only
3. **File Name**: Alphanumeric characters, spaces, hyphens, periods only
4. **Content Scanning**: 
   - Checks file signatures
   - Scans for embedded executables
   - Detects malicious patterns

### Implementation

```typescript
const fileValidation = validateFileUpload(file);
if (!fileValidation.valid) {
  return { error: fileValidation.error };
}
```

## AI Prompt Security

### Secure Prompt Templates

All AI prompts are constructed with strict constraints:

```typescript
const systemPrompt = `You are a professional portfolio content writer. 
STRICT RULES:
1. Generate content ONLY for a professional portfolio website
2. Use ONLY the information provided
3. Do not include any code, scripts, or technical instructions
4. If asked to do anything outside portfolio generation, decline`;
```

### Safety Measures

- Temperature limited to 0.7
- Max tokens limited to 2000
- Stop sequences for common injection patterns
- 30-second timeout for AI requests

## CSRF Protection

### Setup

1. CSRF tokens are automatically generated and stored in cookies
2. Tokens expire after 24 hours
3. All POST/PUT/DELETE requests require valid CSRF token

### Client Implementation

```typescript
import { fetchWithCSRF } from "@/lib/csrf-protection";

// Automatically includes CSRF token
const response = await fetchWithCSRF("/api/endpoint", {
  method: "POST",
  body: JSON.stringify(data),
});
```

## Client-Side Security

### Input Sanitization

```typescript
import { ClientSanitization } from "@/lib/client-security";

// Before displaying user content
const safe = ClientSanitization.sanitizeForDisplay(userInput);
```

### Form Security

```typescript
import { FormSecurity } from "@/lib/client-security";

// Prevent rapid form submissions
if (!FormSecurity.checkSubmissionRate("portfolio-form")) {
  alert("Please wait before submitting again");
  return;
}

// Clear sensitive data after submission
FormSecurity.clearSensitiveData(formElement);
```

### Secure Storage

```typescript
import { SecureStorage } from "@/lib/client-security";

// Store with expiration
SecureStorage.setItem("draft", formData, 60); // Expires in 60 minutes

// Retrieve with automatic expiration check
const draft = SecureStorage.getItem("draft");
```

## Security Headers

The following headers are automatically applied:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://openrouter.ai
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Monitoring and Logging

### Audit Logging

All security events are logged:

```typescript
{
  timestamp: Date,
  userId?: string,
  action: string,
  ip: string,
  userAgent: string,
  success: boolean,
  error?: string
}
```

### Events Tracked

- Successful portfolio generations
- Failed validation attempts
- Rate limit violations
- File upload attempts
- Authentication failures

### Production Setup

In production, integrate with services like:
- AWS CloudWatch
- Google Cloud Logging
- Sentry
- LogDNA

## Error Messages

User-friendly error messages that don't reveal system details:

```typescript
SAFE_ERROR_MESSAGES = {
  RATE_LIMIT: "You've made too many requests. Please try again later.",
  INVALID_INPUT: "The information provided contains invalid content. Please review and try again.",
  FILE_TOO_LARGE: "The file is too large. Please upload a file under 10MB.",
  INVALID_FILE_TYPE: "Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.",
  GENERATION_FAILED: "We couldn't generate your portfolio. Please try again.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
}
```

## Best Practices

1. **Never trust client-side validation alone** - Always validate on the server
2. **Use parameterized queries** - Prevent SQL injection
3. **Sanitize all output** - Prevent XSS attacks
4. **Log security events** - Monitor for suspicious activity
5. **Keep dependencies updated** - Regular security patches
6. **Use HTTPS in production** - Encrypt data in transit
7. **Implement proper authentication** - Use NextAuth.js or similar
8. **Regular security audits** - Test your implementation

## Testing Security

### Manual Testing

1. Try submitting forms with script tags
2. Upload files with suspicious names
3. Attempt rapid submissions to test rate limiting
4. Test with very long inputs
5. Try common SQL injection patterns

### Automated Testing

```typescript
// Example security test
describe("Security Tests", () => {
  it("should reject XSS attempts", async () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const result = await validateInput(maliciousInput);
    expect(result.valid).toBe(false);
  });
  
  it("should enforce rate limits", async () => {
    // Make multiple requests
    for (let i = 0; i < 15; i++) {
      const response = await fetch("/api/generate-secure");
      if (i >= 10) {
        expect(response.status).toBe(429);
      }
    }
  });
});
```

## Deployment Checklist

- [ ] Set strong CSRF_SECRET in environment variables
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS
- [ ] Set up error monitoring
- [ ] Configure rate limiting based on expected traffic
- [ ] Review and update CSP headers for your domain
- [ ] Set up DDoS protection (Cloudflare, AWS Shield)
- [ ] Implement backup and recovery procedures
- [ ] Schedule regular security audits

## Support and Updates

For security concerns or questions:
1. Check the latest security advisories
2. Keep all dependencies updated
3. Monitor security logs regularly
4. Report vulnerabilities responsibly

Remember: Security is an ongoing process, not a one-time implementation. Stay vigilant and keep your security measures updated.