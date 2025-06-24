# Vercel Deployment Guide for AI Portfolio Builder

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub repository connected
- OpenRouter API key

## Step 1: Deploy to Vercel

### Option A: One-Click Deploy (Recommended)
1. Go to your GitHub repo
2. Click "Deploy to Vercel" button (add one to README)
3. Follow the prompts

### Option B: Manual Deploy
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js - click "Deploy"

## Step 2: Set Up Vercel Postgres

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a region (closest to your users)
   - Click "Create"

2. **Environment Variables:**
   - Vercel automatically adds these for you:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
     - `POSTGRES_USER`
     - `POSTGRES_HOST`
     - `POSTGRES_PASSWORD`
     - `POSTGRES_DATABASE`

## Step 3: Add Additional Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Required
OPENROUTER_API_KEY=your_openrouter_api_key
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://your-app.vercel.app

# Optional (for OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email (for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 4: Initialize Database

### Option A: From Your Local Machine
1. First, pull the environment variables:
   ```bash
   vercel env pull .env.local
   ```

2. Run the database initialization:
   ```bash
   npm run db:init
   npm run db:update
   ```

### Option B: Using Vercel Functions
1. Create a temporary API route `/api/setup-db`
2. Visit `https://your-app.vercel.app/api/setup-db`
3. Delete the route after setup

### Option C: Using Vercel Postgres Dashboard
1. Go to Storage → Your Database → Query
2. Run the SQL from `lib/db-schema.sql` and `lib/db-schema-v2.sql`

## Step 5: Set Up OAuth (Optional)

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)

### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `https://your-app.vercel.app/api/auth/callback/github`

## Step 6: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

### Database Connection Issues
- Ensure all Postgres env vars are set
- Check if database is in same region as functions
- Verify connection string format

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure callback URLs are correct for OAuth

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## Local Development with Vercel Postgres

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

## Production Checklist

- [ ] All environment variables set
- [ ] Database initialized
- [ ] OAuth providers configured (if using)
- [ ] Custom domain configured (if applicable)
- [ ] Email service configured
- [ ] Rate limiting tested
- [ ] Analytics configured
- [ ] Error tracking set up (Sentry)
- [ ] Backup strategy in place

## Monitoring

1. **Vercel Analytics** - Built-in performance monitoring
2. **Database Monitoring** - Check Storage tab for usage
3. **Function Logs** - Monitor API performance
4. **Error Tracking** - Set up Sentry or similar

## Scaling Considerations

- **Database**: Vercel Postgres scales automatically
- **Functions**: Set appropriate timeouts and memory
- **Images**: Use Vercel Image Optimization
- **Caching**: Implement proper cache headers

Need help? Check the [Vercel Docs](https://vercel.com/docs) or [create an issue](https://github.com/matthewtrundle/AI-Portfolio-Builder-/issues).