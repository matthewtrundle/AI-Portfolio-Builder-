-- Migration to add edit_count column to portfolios table
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0;

-- Add comment to explain the column
COMMENT ON COLUMN portfolios.edit_count IS 'Number of times the portfolio has been edited (max 5 edits allowed)';