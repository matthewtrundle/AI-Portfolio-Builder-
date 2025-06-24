# AI Portfolio Builder - Pricing Strategy

## Overview
We're implementing a hybrid "Success-Aligned" pricing model that balances accessibility for job seekers with sustainable revenue generation.

## Core Principles
1. **Free access to core value** - Creating and sharing portfolios is always free
2. **Success-based monetization** - Revenue aligns with user success
3. **No friction during job search** - Avoid blocking critical features when users need them most
4. **Community-driven growth** - Successful users help fund the platform for others

## Pricing Tiers

### 🎯 Free Forever
**Price:** $0
**Target:** Active job seekers, students, career changers

**Features:**
- 1 AI-powered portfolio
- Unlimited edits for first 30 days
- Basic analytics (page views, visitor count)
- All templates (with small "Powered by AI Portfolio" badge)
- Standard subdomain (username.aiportfolio.app)
- 3 AI regenerations (lifetime)
- Export as PDF (with watermark)

### 🚀 Pro Job Seeker
**Price:** $9/month or $72/year (33% discount)
**Target:** Serious job seekers wanting every advantage

**Features:**
- Everything in Free, plus:
- 3 portfolios (for different roles/industries)
- Unlimited AI regenerations
- Advanced analytics (visitor locations, time on page, link clicks)
- Custom domain support
- Remove watermark/badge
- A/B testing (test different versions)
- LinkedIn optimization tips
- Priority AI processing
- Export without watermark
- Email support

### 🏢 Teams & Recruiters
**Price:** $19/user/month (minimum 3 users)
**Target:** Bootcamps, career services, recruiting agencies

**Features:**
- Everything in Pro, plus:
- Unlimited portfolios per user
- Admin dashboard
- Bulk portfolio creation
- White-label options
- API access
- Custom branding
- Usage analytics across team
- Priority support
- Custom templates

## Success-Based Donations

### 💝 Pay It Forward Program
After users land a job, we'll reach out with:

**Suggested Contributions:**
- $10 - "Coffee for the team"
- $25 - "Help another job seeker" 
- $50 - "Sponsor a student's Pro access"
- $100+ - "Founding supporter" (special recognition)

**Benefits for Donors:**
- Name on success wall (optional)
- "Success Story" badge on portfolio
- Lifetime Pro features (for $50+)
- Early access to new features

## Implementation Timeline

### Phase 1: Launch (Month 1-3)
- Free tier only
- Focus on user acquisition
- Collect feedback
- Track key metrics

### Phase 2: Monetization (Month 4-6)
- Introduce Pro tier
- Implement 30-day grace period
- Launch donation program
- A/B test pricing

### Phase 3: Scale (Month 7+)
- Add Teams tier
- Implement success-based outreach
- Optimize pricing based on data
- Consider regional pricing

## Key Metrics to Track

### Acquisition
- Sign-up rate
- Portfolio completion rate
- Time to first share

### Engagement
- Monthly active users
- Edits per user
- Portfolio views

### Monetization
- Free to Pro conversion rate (target: 5-8%)
- Average revenue per user (target: $1.50-3.00)
- Donation rate from successful users (target: 3-5%)
- Churn rate (target: <5% monthly)

### Success Metrics
- Users reporting job offers
- Time from sign-up to job offer
- Success stories shared

## Technical Implementation Notes

### Stripe Integration (Future)
- Use Stripe Checkout for subscriptions
- Implement Stripe Customer Portal for self-service
- Set up webhook handlers for subscription events
- Use Stripe's donation/one-time payment options

### Feature Gating
- Implement feature flags for easy testing
- Grace period logic (30 days full access)
- Granular permissions system
- Analytics tracking for feature usage

### Database Schema Updates
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMP;
ALTER TABLE users ADD COLUMN customer_id VARCHAR(255); -- Stripe customer ID

-- Create subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create donations table  
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER, -- in cents
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Marketing Messaging

### Free Users
"Create your AI-powered portfolio in minutes. Free forever."

### Pro Upgrade
"Stand out with advanced analytics and premium features."

### Donation Ask
"You landed the job! 🎉 Help another job seeker by paying it forward."

## Future Considerations

1. **Enterprise Tier** - For companies wanting to help employees showcase skills
2. **Education Discount** - 50% off for verified students
3. **Regional Pricing** - Adjusted pricing for different markets
4. **Referral Program** - Free month for successful referrals
5. **Skills Marketplace** - Connect portfolios with freelance opportunities

## Success Criteria

By Month 6:
- 10,000+ registered users
- 500+ Pro subscribers
- $5,000+ MRR
- 50+ success stories
- <5% monthly churn

## Notes
- Start without payment integration to validate demand
- Be generous with free tier to encourage adoption
- Focus on success stories for social proof
- Consider grandfather pricing for early adopters