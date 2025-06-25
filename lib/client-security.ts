// Client-side security utilities
// Note: This is for UX enhancement only. Never trust client-side validation alone.

// Basic patterns for client-side validation (less strict than server)
const BASIC_INAPPROPRIATE = /\b(fuck|shit|damn|ass|bitch)\b/gi;
const BASIC_INJECTION = /<script|javascript:|onclick|onerror/gi;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Real-time validation for form inputs
export function validateInput(value: string, type: string): { valid: boolean; error?: string } {
  if (!value) return { valid: true }; // Empty is valid, required is handled separately
  
  switch (type) {
    case 'name':
      if (value.length < 2) return { valid: false, error: "Too short" };
      if (value.length > 100) return { valid: false, error: "Too long" };
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return { valid: false, error: "Invalid characters" };
      break;
      
    case 'email':
      if (!EMAIL_PATTERN.test(value)) return { valid: false, error: "Invalid email" };
      break;
      
    case 'url':
      if (value && !URL_PATTERN.test(value)) return { valid: false, error: "Invalid URL" };
      break;
      
    case 'text':
      if (BASIC_INAPPROPRIATE.test(value)) return { valid: false, error: "Please use professional language" };
      if (BASIC_INJECTION.test(value)) return { valid: false, error: "Invalid content detected" };
      break;
  }
  
  return { valid: true };
}

// Debounced validation hook
export function useDebounceValidation(value: string, type: string, delay: number = 500) {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  
  useEffect(() => {
    setIsValidating(true);
    const timer = setTimeout(() => {
      const result = validateInput(value, type);
      setIsValid(result.valid);
      setError(result.error);
      setIsValidating(false);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, type, delay]);
  
  return { isValid, error, isValidating };
}

// Client-side text sanitization (basic)
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

// Character counter with limits
export function useCharacterLimit(maxLength: number) {
  const [value, setValue] = useState('');
  const remaining = maxLength - value.length;
  const percentage = (value.length / maxLength) * 100;
  
  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      setValue(newValue);
    }
  };
  
  return {
    value,
    setValue: handleChange,
    remaining,
    percentage,
    isNearLimit: percentage > 80,
    isAtLimit: percentage >= 100
  };
}

// File validation before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed" };
  }
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: "Invalid file extension" };
  }
  
  return { valid: true };
}

// Rate limiting for client-side (prevents spam clicking)
const clickCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitedClick(
  action: string, 
  callback: () => void, 
  maxClicks: number = 3, 
  windowMs: number = 5000
) {
  const now = Date.now();
  const entry = clickCounts.get(action);
  
  if (entry && entry.resetTime > now) {
    if (entry.count >= maxClicks) {
      console.warn(`Rate limit exceeded for action: ${action}`);
      return;
    }
    entry.count++;
  } else {
    clickCounts.set(action, { count: 1, resetTime: now + windowMs });
  }
  
  callback();
}

// XSS prevention for displaying user content
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Form data validation before submission
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export function validateForm(
  data: Record<string, any>, 
  rules: Record<string, ValidationRule>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && !value) {
      errors[field] = "This field is required";
      continue;
    }
    
    if (value) {
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `Minimum ${rule.minLength} characters required`;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `Maximum ${rule.maxLength} characters allowed`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = "Invalid format";
      } else if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : "Invalid value";
        }
      }
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Secure storage with expiration
export class SecureStorage {
  static set(key: string, value: any, expirationMinutes: number = 60) {
    const item = {
      value: value,
      expiration: Date.now() + (expirationMinutes * 60 * 1000)
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
  
  static get(key: string): any {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiration) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed.value;
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  }
  
  static remove(key: string) {
    localStorage.removeItem(key);
  }
  
  static clear() {
    localStorage.clear();
  }
}

// Import necessary for hooks
import { useState, useEffect } from 'react';

// Error message formatter
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    // Don't expose internal error messages
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return "Network error. Please check your connection and try again.";
    }
    if (error.message.includes('timeout')) {
      return "Request timed out. Please try again.";
    }
  }
  return "An error occurred. Please try again.";
}