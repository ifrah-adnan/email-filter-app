// src/types/index.ts
import { DefaultSession } from "next-auth";

export interface EmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: Date;
}

export interface EmailFilter {
  from?: string;
  to?: string;
  subject?: string;
  after?: Date;
  before?: Date;
  hasAttachment?: boolean;
  labelIds?: string[];
}

// Extension du type de session NextAuth pour inclure le token d'accès Google
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}
