import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@aiportfoliobuilder.com",
    }),
    
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Check if database is configured
          if (!process.env.POSTGRES_URL) {
            console.error("Database not configured. Please set POSTGRES_URL in .env.local");
            return null;
          }
          
          const { rows } = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;
          
          if (rows.length === 0) {
            return null;
          }
          
          const user = rows[0];
          
          // Check password
          const isValid = await bcrypt.compare(credentials.password, user.password_hash);
          
          if (!isValid) {
            return null;
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error && error.message.includes("connect")) {
            console.error("Database connection failed. Check your POSTGRES_URL configuration.");
          }
          return null;
        }
      }
    })
  ],
  
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/dashboard",
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session?.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      if (account?.provider === "email") {
        try {
          // Check if database is configured
          if (!process.env.POSTGRES_URL) {
            console.error("Database not configured for email sign-in");
            return false;
          }
          
          // Check if user exists
          const { rows } = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;
          
          if (rows.length === 0) {
            // Create new user
            await sql`
              INSERT INTO users (email, name, image, email_verified)
              VALUES (${user.email}, ${user.name}, ${user.image}, null)
            `;
          }
          
          return true;
        } catch (error) {
          console.error("Sign in error:", error);
          if (error instanceof Error && error.message.includes("connect")) {
            console.error("Database connection failed during sign-in");
          }
          return false;
        }
      }
      
      return true;
    },
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

// Type augmentation for session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}