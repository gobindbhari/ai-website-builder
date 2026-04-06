import { nodeBasePrompt } from "@/constants/node";
import { BASE_PROMPT, getSystemPrompt } from "@/constants/prompt";
import { reactBasePrompt } from "@/constants/react";
import prisma from "@/lib/prisma";
import { StepFiles } from "@/types";
import { asyncAuthHandler } from "@/utils/asyncHandler";
import { groq } from "@/utils/groqInstance";
import { parseXmlFiles } from "@/utils/step";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.mjs";
import { NextResponse } from "next/server";



// export const POST = asyncAuthHandler(async (req) => {
export const GET = asyncAuthHandler(async (req, userId) => {
    // const { msg: userPrompt } = await req.json()
    const userPrompt = "create a todo app"

    const setupProjectFiles: StepFiles[] = []



    // first phase
    const templateRes = await groq.chat.completions.create({
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
                content: userPrompt
            }
        ]
    })

    const answer = templateRes.choices[0].message.content
    console.log("answer", answer);

    const templatePrompts: ChatCompletionMessageParam[] = []

    if (String(answer) === "react") {
        const defaultPrompt: string = `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`

        const allPrompts: ChatCompletionMessageParam[] = [
            BASE_PROMPT,
            defaultPrompt,
            reactBasePrompt,
            userPrompt
        ].map((p) => {
            return {
                role: "user",
                content: p
            }
        })

        // console.log("is array : =====", allPrompts)

        templatePrompts.push(...allPrompts)
        setupProjectFiles.push(...parseXmlFiles(reactBasePrompt))
    }
    if (String(answer) === "node") {
        const defaultPrompt: string = `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`

        const allPrompts: ChatCompletionMessageParam[] = [
            defaultPrompt,
            nodeBasePrompt,
            userPrompt
        ].map((p) => {
            return {
                role: "user",
                content: p
            }
        })

        // console.log("is array 79 : =====", allPrompts)

        templatePrompts.push(...allPrompts)
        setupProjectFiles.push(...parseXmlFiles(nodeBasePrompt))
    }

    // second phase
    let attempts = 0
    let content: string | null = null
    // console.log("setupProjectFiles ",setupProjectFiles)
    // console.log("type of setupProjectFiles ",Array.isArray(setupProjectFiles))

    // return NextResponse.json(
    //         { error: "Failed to get response after 5 attempts" },
    //         { status: 500 }
    //     )

    while (attempts < 5 && !content) {
        attempts++

        console.log(`LLM attempt #${attempts}`)
        // console.log("templatePrompts ",templatePrompts)

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            // max_completion_tokens: 200,
            messages: [
                {
                    role: "system",
                    content: `${getSystemPrompt()}
                            You are authorized to fully design, develop, and configure projects when requested.
                            Ensure all implementations are functional, error-free, and all text/content is clearly visible and properly rendered.
                            and make sure it is typescript project 
                                            `
                },
                ...templatePrompts
            ],
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

    const titleMatch = content.match(/title="([^"]*)"/)?.[1];
    const framwork = answer === "react" ? "React" : "Express"

    const newFiles = parseXmlFiles(content)

    const safeSetupFiles = Array.isArray(setupProjectFiles) ? setupProjectFiles : []
    const safeNewFiles = Array.isArray(newFiles) ? newFiles : []

    const completedFiles = [
        ...safeSetupFiles.map((f) => {
            const updated = safeNewFiles.find((t) => t.title === f.title)
            return updated ?? f
        }),
        ...safeNewFiles.filter(
            (t) => !safeSetupFiles.some((f) => f.title === t.title)
        ),
    ]
    // .map((p) => ({
    //     ...p,
    //     type: "File",
    //     projectId,
    // }))

    const assistantMsg = content.split("<boltArtifact")[0].replaceAll('\n\n', "")

    const fileMsg = completedFiles
        .filter((c): c is typeof c & { path: string } => typeof c.path === "string")
        .map(c => c.path)

    const arrUserPrompt = [userPrompt]
    const arrAssistanceMsg = [assistantMsg]
    const arrFileMsg = [...fileMsg]

    // third phase db call
    const { projectId } = await prisma.$transaction(
        async (tx) => {

            const project = await tx.project.create({
                data: {
                    name: titleMatch!,
                    framwork: framwork,
                    userId: userId
                },
            });

            const projectId = project.id;

            const projectfiles = await tx.projectFile.createMany({
                data: completedFiles.map((f) => {
                    return {
                        ...f,
                        code: f.code || "",
                        path: f.path || "",
                        type: "File",
                        projectId
                    }
                }),
                // select: {
                //     id: true
                // }
            });

            // const updateProject = await tx.project.update({
            //     where: {
            //         id: projectId
            //     },
            //     data: {
            //         projectFiles: {
            //             connect: projectfiles
            //         }
            //     }
            // })

            const firstChat = await tx.chat.create({
                data: {
                    role: "User",
                    message: arrUserPrompt,
                    projectId: projectId
                }
            })

            const secondChat = await tx.chat.create({
                data: {
                    role: "Assistant",
                    message: arrAssistanceMsg,
                    projectId: projectId
                }
            })

            const thirdChat = await tx.chat.create({
                data: {
                    role: "Assistant",
                    message: arrFileMsg,
                    projectId: projectId
                }
            })

            return {
                projectId
            }
        },
        {
            maxWait: 5000, // Max wait to acquire transaction (default: 2000ms)
            timeout: 10000, // Max transaction run time (default: 5000ms)
        }
    )

    if (!projectId) {
        return NextResponse.json({ message: "Something went wrong, Please try again!", error: "Project is not created" }, { status: 404 })
    }

    return NextResponse.json({ response: { projectId, message: "Project is created" } }, { status: 200 })
});


    // const project = await prisma.project.create({
    //     data: {
    //         name: titleMatch!,
    //         framwork: framwork,
    //         userId: userId
    //     },
    // })

    // if (!project) {
    //     return NextResponse.json({ message: "Something went wrong, Please try again!", error: "Project is not created" }, { status: 404 })
    // }

    // const projectId = project.id

    // setupProjectFiles
    // const newFiles = parseXmlFiles(content)
    // console.log("newFiles ", newFiles)
    // console.log("newFiles ", Array.isArray(newFiles))

    // const safeSetupFiles = Array.isArray(setupProjectFiles) ? setupProjectFiles : []
    // const safeNewFiles = Array.isArray(newFiles) ? newFiles : []

    // const completedFiles = [
    //     ...safeSetupFiles.map((f) => {
    //         const updated = safeNewFiles.find((t) => t.title === f.title)
    //         return updated ?? f
    //     }),
    //     ...safeNewFiles.filter(
    //         (t) => !safeSetupFiles.some((f) => f.title === t.title)
    //     ),
    // ].map((p) => ({
    //     ...p,
    //     type: "File",
    //     projectId,
    // }))

    // console.log("type of completedFiles is array ", Array.isArray(completedFiles))

    // const projectfiles = await prisma.projectFile.createManyAndReturn({
    //     data: completedFiles.map((f) => {
    //         return {
    //             ...f,
    //             code: f.code || "",
    //             path: f.path || "",
    //             type: "File",
    //             projectId
    //         }
    //     }),
    //     select: {
    //         id: true
    //     }
    // })

    // if (!projectfiles) {
    //     return NextResponse.json({
    //         message: "Something went wrong, Please try again!",
    //         error: "Project files are not created"
    //     }, { status: 404 })
    // }

    // console.log("projectfiles --- 189 ---", projectfiles)

    // const updateProject = await prisma.project.update({
    //     where: {
    //         id: projectId
    //     },
    //     data: {
    //         projectFiles: {
    //             connect: projectfiles
    //         }
    //     }
    // })

    // const assistantMsg = content.split("<boltArtifact")[0].replaceAll('\n\n', "")

    // const fileMsg = completedFiles
    //     .filter((c): c is typeof c & { path: string } => typeof c.path === "string")
    //     .map(c => c.path)

    // const fileMsg = completedFiles
    //     .map(c => { if (c.path !== undefined) return c.path })
    //     .filter(f => f !== undefined)


    // console.log("type of fileMsg is array ", Array.isArray(fileMsg))

    // const arrUserPrompt = [userPrompt]
    // const arrAssistanceMsg = [assistantMsg]
    // const arrFileMsg = [...fileMsg]

    // const createChats = await prisma.$transaction([
    // const firstChat = await prisma.chat.create({
    //     data: {
    //         role: "User",
    //         message: arrUserPrompt,
    //         projectId: projectId
    //     }
    // })
    // if (!firstChat) {
    //     return NextResponse.json({ message: "Something went wrong, Please try again!", error: "Project chats are not created" }, { status: 404 })
    // }
    // const secondChat = await prisma.chat.create({
    //     data: {
    //         role: "Assistant",
    //         message: arrAssistanceMsg,
    //         projectId: projectId
    //     }
    // })
    // if (!secondChat) {
    //     return NextResponse.json({ message: "Something went wrong, Please try again!", error: "Project chats are not created" }, { status: 404 })
    // }
    // const thirdChat = await prisma.chat.create({
    //     data: {
    //         role: "Assistant",
    //         message: arrFileMsg,
    //         projectId: projectId
    //     }
    // })
    // if (!thirdChat) {
    //     return NextResponse.json({ message: "Something went wrong, Please try again!", error: "Project chats are not created" }, { status: 404 })
    // }
    // ])

    // if (!createChats) {
    //     return NextResponse.json({
    //         message: "Something went wrong, Please try again!",
    //         error: "Project chats are not created"
    //     }, { status: 404 })
    // }
