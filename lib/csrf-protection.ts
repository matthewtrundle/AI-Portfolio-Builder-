import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CSRFToken {
  token: string;
  expires: number;
}

// Generate a new CSRF token
export function generateCSRFToken(): CSRFToken {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString("hex");
  const expires = Date.now() + TOKEN_EXPIRY;
  
  return { token, expires };
}

// Create a signed CSRF token
export function signCSRFToken(token: string, expires: number): string {
  const data = `${token}.${expires}`;
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(data);
  const signature = hmac.digest("hex");
  
  return `${data}.${signature}`;
}

// Verify a signed CSRF token
export function verifySignedCSRFToken(signedToken: string): { valid: boolean; token?: string } {
  try {
    const parts = signedToken.split(".");
    if (parts.length !== 3) {
      return { valid: false };
    }
    
    const [token, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);
    
    // Check expiration
    if (Date.now() > expires) {
      return { valid: false };
    }
    
    // Verify signature
    const data = `${token}.${expires}`;
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    
    // Use timing-safe comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false };
    }
    
    return { valid: true, token };
  } catch (error) {
    return { valid: false };
  }
}

// Set CSRF cookie
export async function setCSRFCookie() {
  const { token, expires } = generateCSRFToken();
  const signedToken = signCSRFToken(token, expires);
  
  const cookieStore = cookies();
  cookieStore.set(CSRF_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expires),
  });
  
  return token;
}

// Get CSRF token from cookie
export async function getCSRFTokenFromCookie(): Promise<string | null> {
  const cookieStore = cookies();
  const signedToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  
  if (!signedToken) {
    return null;
  }
  
  const result = verifySignedCSRFToken(signedToken);
  return result.valid ? result.token! : null;
}

// Verify CSRF token from request
export async function verifyCSRFToken(request: Request): Promise<boolean> {
  // Skip CSRF for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }
  
  // Get token from cookie
  const cookieToken = await getCSRFTokenFromCookie();
  if (!cookieToken) {
    return false;
  }
  
  // Get token from header or body
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  if (!headerToken) {
    // Try to get from body if JSON
    if (request.headers.get("content-type")?.includes("application/json")) {
      try {
        const body = await request.clone().json();
        const bodyToken = body._csrf;
        if (bodyToken) {
          return crypto.timingSafeEqual(
            Buffer.from(cookieToken),
            Buffer.from(bodyToken)
          );
        }
      } catch {
        // Body parsing failed
      }
    }
    return false;
  }
  
  // Compare tokens using timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

// React hook for CSRF protection
export function useCSRFToken() {
  if (typeof window === "undefined") {
    return { token: null };
  }
  
  // Get token from meta tag or cookie
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  const token = metaTag?.getAttribute("content") || null;
  
  return {
    token,
    headers: token ? { [CSRF_HEADER_NAME]: token } : {},
  };
}

// Middleware for CSRF protection
export async function csrfMiddleware(request: Request): Promise<Response | null> {
  const isValid = await verifyCSRFToken(request);
  
  if (!isValid) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing CSRF token" }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  return null; // Continue to next middleware
}

// Helper to add CSRF token to fetch requests
export function fetchWithCSRF(url: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" 
    ? document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
    : null;
  
  if (token && !["GET", "HEAD"].includes(options.method || "GET")) {
    options.headers = {
      ...options.headers,
      [CSRF_HEADER_NAME]: token,
    };
  }
  
  return fetch(url, options);
}