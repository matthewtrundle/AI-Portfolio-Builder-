import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
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
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      if (account?.provider === "google" || account?.provider === "email") {
        try {
          // Check if user exists
          const { rows } = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;
          
          if (rows.length === 0) {
            // Create new user
            await sql`
              INSERT INTO users (email, name, image, email_verified)
              VALUES (${user.email}, ${user.name}, ${user.image}, ${account.provider === "google" ? new Date().toISOString() : null})
            `;
          } else if (account.provider === "google" && !rows[0].email_verified) {
            // Verify email if signing in with Google
            await sql`
              UPDATE users 
              SET email_verified = ${new Date().toISOString()}, name = ${user.name}, image = ${user.image}
              WHERE email = ${user.email}
            `;
          }
          
          return true;
        } catch (error) {
          console.error("Sign in error:", error);
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