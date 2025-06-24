const { sql } = require('@vercel/postgres');

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Create portfolios table
    await sql`
      CREATE TABLE IF NOT EXISTS portfolios (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        pin_hash VARCHAR(255) NOT NULL,
        portfolio_data JSONB NOT NULL,
        generated_code TEXT,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Created portfolios table');

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_portfolios_email ON portfolios(email)
    `;

    console.log('Created indexes');
    console.log('Database initialization complete!');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };