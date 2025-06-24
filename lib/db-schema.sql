-- Create portfolios table
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
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);

-- Create index for email lookups (for finding user's portfolios)
CREATE INDEX IF NOT EXISTS idx_portfolios_email ON portfolios(email);