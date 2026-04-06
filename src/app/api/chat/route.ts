import { getSystemPrompt } from "@/constants/prompt";
import { asyncAuthHandler } from "@/utils/asyncHandler";
import { groq } from "@/utils/groqInstance";
import { NextResponse } from "next/server";


export const POST = asyncAuthHandler(async (req) => {
    const body = await req.json()
    const { messages } = body

    // const userMsg = messages.map((e: string) => {
    //     return {
    //         role: "user",
    //         content: e
    //     }
    // })

    // console.log("messages 18 /api/chat --", ...messages);


    let attempts = 0
    let content: string | null = null

    while (attempts < 5 && !content) {
        attempts++

        console.log(`LLM attempt #${attempts}`)



        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            // max_completion_tokens: 200,
            messages: [
                {
                    role: "system",
                    content: `${getSystemPrompt()}
                        You are authorized to fully design, develop, and configure projects when requested.
                        Ensure all implementations are functional, error-free, and all text/content is clearly visible and properly rendered.
                                        `
                },
                // userMsg
                ...messages
            ],
            // If set, partial message deltas will be sent.
            // stream: true,
        })
        content = response?.choices?.[0]?.message?.content?.trim() || null

        if (!content) {
            console.warn(`Empty response on attempt ${attempts}`)
        }

    }

    if (!content) {
        return NextResponse.json(
            { error: "Failed to get response after 5 attempts" },
            { status: 500 }
        )
    }
    // console.log("content --", content);


    return NextResponse.json({ response: content }, { status: 200 })
    // return NextResponse.json({ response: response.choices[0].message.content }, { status: 200 })

})