// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
    provider?: string;
  }

  interface Token {
    accessToken?: string;
    provider?: string;
  }

  interface Session {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}
