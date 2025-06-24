const { sql } = require('@vercel/postgres');

async function updateDatabase() {
  try {
    console.log('Updating database schema to v2...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        email_verified TIMESTAMP,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Created users table');

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Created sessions table');

    // Create verification tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `;
    console.log('✓ Created verification_tokens table');

    // Add new columns to portfolios table
    await sql`
      ALTER TABLE portfolios 
      ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE
    `;
    
    await sql`
      ALTER TABLE portfolios 
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true
    `;
    
    await sql`
      ALTER TABLE portfolios 
      ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255)
    `;
    
    await sql`
      ALTER TABLE portfolios 
      ADD COLUMN IF NOT EXISTS template_id VARCHAR(50)
    `;
    console.log('✓ Updated portfolios table');

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id)
    `;
    console.log('✓ Created indexes');

    console.log('Database update complete!');

  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateDatabase();
}

module.exports = { updateDatabase };