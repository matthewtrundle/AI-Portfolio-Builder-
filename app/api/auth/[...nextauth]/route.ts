import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { authOptionsDev } from "@/lib/auth-dev";

// Use development auth if no database is configured
const isDevelopment = !process.env.POSTGRES_URL && process.env.NODE_ENV === 'development';
const handler = NextAuth(isDevelopment ? authOptionsDev : authOptions);

export { handler as GET, handler as POST };