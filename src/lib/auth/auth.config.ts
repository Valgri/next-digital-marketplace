import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db/prisma";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          console.log("Attempting to find user with email:", credentials.email);
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.log("User not found");
            return null;
          }

          console.log("User found:", {
            id: user.id,
            email: user.email,
            hasPassword: !!user.password
          });

          console.log("Comparing passwords");
          const isPasswordValid = await compare(credentials.password, user.password);
          console.log("Password comparison result:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Password invalid");
            return null;
          }

          console.log("Authentication successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }: { token: JWT; session: Session }) {
      console.log("Session callback - token:", token);
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as Role;
      }
      console.log("Session callback - session:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - token:", token);
      console.log("JWT callback - user:", user);
      
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email as string,
        },
      });

      if (!dbUser) {
        if (user) {
          // Create new user for Google authentication
          const newUser = await prisma.user.create({
            data: {
              email: token.email as string,
              name: token.name as string,
              image: token.picture as string,
              password: "", // Empty password for Google auth
              role: "USER",
            },
          });
          token.id = newUser.id;
          token.role = newUser.role;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      };
    },
  },
}; 