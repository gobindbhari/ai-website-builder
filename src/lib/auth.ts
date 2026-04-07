import jwt from "jsonwebtoken";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
// import { username } from "better-auth/plugins"



const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: string;
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};


// ------------------------------------------------------------------

// const getBaseURL = () => {
//   return headers().then((h) => {
//     const host = h.get('host');
//     const protocol = h.get('x-forwarded-proto') || 'http';

//     return `${protocol}://${host}`;
//   });
// };

// better auth
export const auth = betterAuth({

  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24 * 2, // Optional: refresh session after 1 day of inactivity
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour
      strategy: "compact"
    }
  },

  baseURL: {
    allowedHosts: [ "https://ai-website-builder-pink.vercel.app", "*.vercel.app", ],
    fallback: "http://localhost:3000"
  },


  // user: {
  //   fields: {
  //     name: "name",
  //     email: "email",
  //     password: "password",
  //     image: "avatarUrl", // 👈 map this
  //   },
  // },

  //...other options
  emailAndPassword: {
    enabled: true,
  },

  // socialProviders: {
  //   // github: {
  //   //   clientId: process.env.GITHUB_CLIENT_ID as string,
  //   //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   // },
  // },

  // plugins: [
  //   username()
  // ]
});