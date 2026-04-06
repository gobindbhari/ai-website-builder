import jwt from "jsonwebtoken";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
// import { username } from "better-auth/plugins"



const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: string;
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};


// ------------------------------------------------------------------



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