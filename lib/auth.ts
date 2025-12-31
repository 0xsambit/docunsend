import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

const emailServer = process.env.AUTH_EMAIL_SERVER;
const emailFrom = process.env.AUTH_EMAIL_FROM;

const providers = [
  emailServer && emailFrom
    ? EmailProvider({
        server: emailServer,
        from: emailFrom,
      })
    : null,
  process.env.GITHUB_ID && process.env.GITHUB_SECRET
    ? GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    : null,
  process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
    ? Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      })
    : null,
].filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },
  trustHost: true,
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
