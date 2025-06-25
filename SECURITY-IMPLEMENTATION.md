# Security Implementation Guide

## Overview
Comprehensive security guardrails to prevent abuse, injection attacks, and inappropriate content in the AI Portfolio Builder.

## Security Layers

### 1. Input Validation
- **Zod Schemas**: Strict validation for all user inputs
- **Character Limits**: Prevent DoS through massive inputs
- **Format Validation**: Email, URL, and name patterns
- **Array Limits**: Max 10 experiences, 20 skills, etc.

### 2. Content Moderation
```typescript
// Blocked patterns:
- Profanity and slurs
- Violence-related terms
- Adult content
- Injection attempts (SQL, XSS, prompt injection)
- Sensitive info (SSN, credit cards)
```

### 3. Rate Limiting
- **API Calls**: 10 requests/hour per IP
- **File Uploads**: 5 uploads/hour per IP
- **Client-side**: Prevents spam clicking
- **Automatic cleanup**: Expired entries removed

### 4. File Upload Security
- **Size Limit**: 10MB maximum
- **Type Whitelist**: PDF, DOC, DOCX, TXT only
- **Signature Verification**: Checks file magic numbers
- **Content Scanning**: Detects malicious patterns

### 5. AI Safety
- **Constrained Prompts**: System prompts prevent off-topic generation
- **Token Limits**: Max 2000 tokens per request
- **Stop Sequences**: Blocks code execution attempts
- **Output Validation**: Checks AI responses for injection attempts
- **30-second timeout**: Prevents runaway requests

## Implementation

### Server-Side (Required)

1. **Update API Routes**:
```typescript
// Replace existing routes with secure versions
import { portfolioInputSchema, validateRequest } from '@/lib/security-guardrails';

// In your API route:
const validation = await validateRequest(request);
if (!validation.valid) {
  return NextResponse.json({ error: validation.error }, { status: 429 });
}

const data = portfolioInputSchema.parse(body);
```

2. **Add Security Headers**:
```typescript
import { getSecurityHeaders } from '@/lib/security-guardrails';

return NextResponse.json(data, { headers: getSecurityHeaders() });
```

3. **Log Security Events**:
```typescript
logSecurityEvent({
  type: 'injection_attempt',
  identifier: request.headers.get('x-forwarded-for') || 'unknown',
  details: { attempted: maliciousInput }
});
```

### Client-Side (Enhancement)

1. **Real-time Validation**:
```typescript
import { validateInput, useDebounceValidation } from '@/lib/client-security';

const { isValid, error } = useDebounceValidation(value, 'email');
```

2. **Character Limits**:
```typescript
import { useCharacterLimit } from '@/lib/client-security';

const { value, setValue, remaining, isNearLimit } = useCharacterLimit(500);
```

3. **File Validation**:
```typescript
import { validateFile } from '@/lib/client-security';

const validation = validateFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}
```

## Error Messages

### User-Friendly Messages
- "Please check your input and try again"
- "File size exceeds 10MB limit"
- "Please use professional language"
- "Rate limit exceeded. Try again in X seconds"

### Never Expose
- Stack traces
- Database errors
- Internal API errors
- System paths

## Monitoring

### Security Events to Track
1. **Rate Limit Violations**: Track repeat offenders
2. **Injection Attempts**: Log and block IPs
3. **File Rejections**: Monitor for patterns
4. **AI Anomalies**: Unusual generation requests

### Metrics
- Failed validation attempts per hour
- Average response time
- Rate limit hits
- Successful vs failed generations

## Testing

### Security Test Cases
1. **SQL Injection**: `'; DROP TABLE users; --`
2. **XSS**: `<script>alert('xss')</script>`
3. **Prompt Injection**: "Ignore previous instructions"
4. **File Bombs**: Large files, zip bombs
5. **Rate Limiting**: Rapid repeated requests

### Load Testing
```bash
# Test rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/generate-secure \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User"}'
done
```

## Environment Variables

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000    # 1 hour
RATE_LIMIT_MAX_REQUESTS=10      # Per window
RATE_LIMIT_UPLOAD_MAX=5         # File uploads

# Security
MAX_FILE_SIZE_MB=10
MAX_INPUT_LENGTH=50000
ENABLE_SECURITY_LOGGING=true
```

## Best Practices

1. **Defense in Depth**: Multiple layers of security
2. **Fail Secure**: Reject suspicious input by default
3. **Log Everything**: But don't log sensitive data
4. **Regular Updates**: Keep security patterns current
5. **User Education**: Clear error messages guide correct usage

## Future Enhancements

1. **Redis Rate Limiting**: For distributed deployments
2. **ML-based Detection**: Train on attack patterns
3. **IP Reputation**: Block known bad actors
4. **Content Fingerprinting**: Detect duplicate spam
5. **Webhook Alerts**: Real-time security notifications

## Quick Start

1. Copy security files to your project
2. Update your API routes to use secure versions
3. Add client-side validation to forms
4. Configure environment variables
5. Test with provided test cases
6. Monitor security logs

Remember: Client-side validation is for UX only. Always validate on the server!