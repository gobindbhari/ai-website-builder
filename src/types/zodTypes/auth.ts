import { z } from "zod";

export const signupSchema = z.object({
    email: z
        .string("Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters long"),

    name: z
        .string("Username is required")
        .min(3, "Username must be at least 3 characters long"),
});


export const signinSchema = z.object({
    email: z
        .string("Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z.object({
    userName: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .optional(),

    avatarUrl: z
        .string()
        .url("Please provide a valid URL for avatar")
        .optional(),
});