import { NextResponse } from "next/server";
import { auth } from "../lib/auth";
import { headers } from "next/headers";


type Handler = (req: Request) => Promise<Response>
type AuthHandler = (req: Request, userId: string) => Promise<Response>

export const asyncHandler = (handler: Handler): Handler => {
    return async (req: Request) => {
        try {
            console.log(`route ${req.url} ---- \n`);
            return await handler(req)
        } catch (error) {
            console.log(`error in ${req.url} route ---- \n`, error);
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
            );
        }
    }
}


export const asyncAuthHandler = (handler: AuthHandler) => {
    return async (req: Request) => {
        try {
            console.log(`route ${req.url} ---- start \n`);
            const session = await auth.api.getSession({
                headers: req.headers
                // headers: await headers()
            })

            if (!session) {
                return NextResponse.json(
                    { message: "Unauthorized" },
                    { status: 401 }
                );
            }

            const userId = session.user.id

            return await handler(req, userId)
        } catch (error) {
            console.log(`error in ${req.url} route ---- \n`, error);
            return NextResponse.json(
                { error: "internal server error" },
                // { error: "Something went wrong" },
                { status: 500 }
            );
        }
    }
}

