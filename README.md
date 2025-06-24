# AI Portfolio Builder

Build your own professional AI/Data Science portfolio website in minutes using AI.

## 🚀 Features

- **AI-Powered Content Generation**: Uses OpenRouter/OpenAI to generate compelling portfolio content
- **Instant Shareable Links**: Get a unique URL instantly (e.g., `/p/john-doe-x7k9`)
- **PIN-Based Editing**: Secure 6-digit PIN for editing/deleting your portfolio
- **No Sign-Up Required**: Start building immediately, no account needed
- **Professional Templates**: Based on successful portfolio designs
- **One-Click Deploy**: Export and deploy to your own Vercel account
- **Mobile-Responsive**: Looks great on all devices
- **SEO-Optimized**: Built with best practices for search visibility
- **View Analytics**: See how many people viewed your portfolio

## 🎯 Who is this for?

- Data Scientists looking to showcase their work
- AI/ML Engineers building their personal brand
- Analytics Leaders transitioning to new roles
- Anyone who wants a professional portfolio without coding

## 🛠️ How it works

1. **Input Your Information**: Fill out a simple form with your background, experience, and projects
2. **AI Generation**: Our AI creates compelling content based on your input
3. **Preview & Edit**: Review and customize the generated content
4. **Deploy**: One-click deploy to Vercel with your own domain

## 🏃‍♂️ Quick Start

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your OpenRouter API key
   - Connect Vercel Postgres (see Database Setup below)
4. Initialize database: `npm run db:init`
5. Run locally: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

Create a `.env.local` file with:

```
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Vercel Postgres (automatically set when connected)
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE=""
```

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)
1. Deploy to Vercel
2. Go to your project dashboard
3. Navigate to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Environment variables will be automatically added
6. Run `npm run db:init` to create tables

### Option 2: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database
3. Add connection string to `.env.local`
4. Run `npm run db:init`

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a PR.

## 💡 Inspiration

Inspired by the need to move beyond traditional resumes in the age of AI filtering.

Built with ❤️ by Matthew Rundle