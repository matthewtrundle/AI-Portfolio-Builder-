import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Development auth configuration without database
export const authOptionsDev: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Development",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials) {
        // Development only - accept any login
        if (credentials?.email && credentials?.password) {
          return {
            id: "dev-user-1",
            email: credentials.email,
            name: "Development User",
            image: null,
          };
        }
        return null;
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
    async jwt({ token, user }) {
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