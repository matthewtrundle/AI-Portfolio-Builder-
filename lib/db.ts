import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export interface Portfolio {
  id?: number;
  slug: string;
  name: string;
  email: string;
  pin_hash: string;
  portfolio_data: any;
  generated_code?: string;
  view_count: number;
  created_at?: Date;
  updated_at?: Date;
}

// Generate a unique slug from name
export function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomSuffix}`;
}

// Hash PIN for security
export function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

// Verify PIN
export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

// Create a new portfolio
export async function createPortfolio(
  data: any,
  pin: string,
  generatedCode?: string,
  userId?: string
): Promise<{ slug: string; pin: string }> {
  const slug = generateSlug(data.name);
  const pinHash = hashPin(pin);
  
  try {
    if (userId) {
      // Create portfolio linked to user
      await sql`
        INSERT INTO portfolios (slug, name, email, pin_hash, portfolio_data, generated_code, user_id)
        VALUES (${slug}, ${data.name}, ${data.email}, ${pinHash}, ${JSON.stringify(data)}, ${generatedCode}, ${userId})
      `;
    } else {
      // Create anonymous portfolio (backward compatibility)
      await sql`
        INSERT INTO portfolios (slug, name, email, pin_hash, portfolio_data, generated_code)
        VALUES (${slug}, ${data.name}, ${data.email}, ${pinHash}, ${JSON.stringify(data)}, ${generatedCode})
      `;
    }
    
    return { slug, pin };
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw new Error('Failed to create portfolio');
  }
}

// Get portfolio by slug
export async function getPortfolio(slug: string): Promise<Portfolio | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM portfolios WHERE slug = ${slug}
    `;
    
    if (rows.length === 0) return null;
    
    // Increment view count
    await sql`
      UPDATE portfolios 
      SET view_count = view_count + 1 
      WHERE slug = ${slug}
    `;
    
    return rows[0] as Portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

// Update portfolio
export async function updatePortfolio(
  slug: string,
  pin: string,
  data: any,
  generatedCode?: string
): Promise<boolean> {
  try {
    // First verify the PIN
    const { rows } = await sql`
      SELECT pin_hash FROM portfolios WHERE slug = ${slug}
    `;
    
    if (rows.length === 0) return false;
    
    if (!verifyPin(pin, rows[0].pin_hash)) {
      return false;
    }
    
    // Update the portfolio
    await sql`
      UPDATE portfolios 
      SET 
        portfolio_data = ${JSON.stringify(data)},
        generated_code = ${generatedCode},
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
    `;
    
    return true;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return false;
  }
}

// Delete portfolio
export async function deletePortfolio(slug: string, pin: string): Promise<boolean> {
  try {
    // First verify the PIN
    const { rows } = await sql`
      SELECT pin_hash FROM portfolios WHERE slug = ${slug}
    `;
    
    if (rows.length === 0) return false;
    
    if (!verifyPin(pin, rows[0].pin_hash)) {
      return false;
    }
    
    // Delete the portfolio
    await sql`
      DELETE FROM portfolios WHERE slug = ${slug}
    `;
    
    return true;
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return false;
  }
}

// Get portfolios by email (for user's dashboard)
export async function getPortfoliosByEmail(email: string): Promise<Portfolio[]> {
  try {
    const { rows } = await sql`
      SELECT slug, name, created_at, view_count 
      FROM portfolios 
      WHERE email = ${email}
      ORDER BY created_at DESC
    `;
    
    return rows as Portfolio[];
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }
}