-- Users table (new)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (for NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification tokens (for email verification & password reset)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Accounts table (for OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  UNIQUE(provider, provider_account_id)
);

-- Update portfolios table
ALTER TABLE portfolios 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255),
  ADD COLUMN IF NOT EXISTS template_id VARCHAR(50);

-- Portfolio templates table
CREATE TABLE IF NOT EXISTS portfolio_templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  category VARCHAR(100),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio analytics table (for detailed tracking)
CREATE TABLE IF NOT EXISTS portfolio_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
  visitor_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referer VARCHAR(500),
  page_views INTEGER DEFAULT 1,
  time_spent INTEGER, -- in seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions table (for premium features)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL, -- 'free', 'pro', 'team'
  status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'expired'
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_portfolio_id ON portfolio_analytics(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON portfolio_analytics(created_at);