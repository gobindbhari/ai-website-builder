import { nodeBasePrompt } from "@/constants/node";
import { BASE_PROMPT } from "@/constants/prompt";
import { reactBasePrompt } from "@/constants/react";
import { asyncAuthHandler, asyncHandler } from "@/utils/asyncHandler";
import { groq } from "@/utils/groqInstance";
import { NextResponse } from "next/server";



export const POST = asyncAuthHandler(async (req) => {
    const body = await req.json()
    const { msg } = body
    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        max_completion_tokens: 200,
        messages: [
            {
                role: "system",
                content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
            },
            {
                role: "user",
                // content: "create a node server"
                content: msg
            }
        ]
    })

    const answer =  response.choices[0].message.content
    console.log("answer", answer);

    if (String(answer) === "react") {
        return NextResponse.json(
            {
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            },
            {
                status: 200
            }
        )
    }
    if (String(answer) === "node") {
        return NextResponse.json(
            {
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            },
            {
                status: 200
            }
        )
    }

    return NextResponse.json({ message: "You cant access this" }, { status: 403 })
})