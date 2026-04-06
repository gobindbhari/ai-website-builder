import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"


export default async function proxy(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    const pathname = req.nextUrl.pathname

    const protectedPages = ["/builder", "/builder-streams"]
    if (!session && protectedPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    };

    if (session && ["/signin", "signup"].includes(pathname)) {
    //   router.push("/")
    return NextResponse.redirect(new URL("/", req.url) )
    }

    // console.log("page nextUrl", req.nextUrl) // it's return  '/signin'
    // console.log("page url", req.url) // it's return 'http://localhost:3000/signin'

    return NextResponse.next();

}

export const config = {
    matcher: ["/signin", "/signup", "/builder", "/builder-streams"]
}