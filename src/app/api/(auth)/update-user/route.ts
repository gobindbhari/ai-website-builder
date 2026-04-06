import { asyncAuthHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/types/zodTypes/auth";


export const POST = asyncAuthHandler(async (req, userId) => {
    const body = await req.json();

    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            // { error: parsed.error.flatten().fieldErrors },
            { error: "All fields are reqiured" },
            { status: 400 }
        );
    }

    // const userId = "USER_ID_FROM_AUTH"; // replace with real auth

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: parsed.data,
    });

    return NextResponse.json({
        message: "User updated",
        user: updatedUser,
    });
})