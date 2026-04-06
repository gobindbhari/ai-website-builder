// import type { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user?: DefaultSession["user"] & {
//       id?: string;
//       userName?: string | null;
//     };
//   }

//   interface User {
//     id: string;
//     userName?: string | null;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id?: string;
//     userName?: string | null;
//   }
// }