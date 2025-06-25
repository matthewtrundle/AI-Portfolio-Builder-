// Script to run the edit_count migration
// Run with: node scripts/run-migration.js

const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  try {
    console.log('Adding edit_count column to portfolios table...');
    
    // Add edit_count column if it doesn't exist
    await sql`
      ALTER TABLE portfolios 
      ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0
    `;
    
    console.log('✅ Migration completed successfully!');
    console.log('The edit_count column has been added to track portfolio edits.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();