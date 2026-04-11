"use client"

import { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CodeEditor } from '@/components/CodeEditor';
import { FileExplorer } from '@/components/FileExplorer';
import { Loader } from '@/components/Loader';
import { PreviewFrame } from '@/components/PreviewFrame';
import PromptInputBox from '@/components/PromptInputBox';
import { StepsList } from '@/components/StepsList';
import { TabView } from '@/components/TabView';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebContainer } from '@/hooks/useWebContainer';
import { cn } from '@/lib/utils';
import { ChatHistory, ChatMessage, FileItem, Step, StepType } from '@/types';
import { parseXml, parseXmlChat } from '@/utils/step';
import axios from 'axios';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { string } from 'zod';


const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

const Page = () => {
    const router = useRouter()
    const [prompt, setPrompt] = useState("")

    const [userPrompt, setUserPrompt] = useState("");
    const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [templateSet, setTemplateSet] = useState(false);
    const webcontainer = useWebContainer();

    const [currentStep, setCurrentStep] = useState(1);
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    const [steps, setSteps] = useState<Step[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

    const [files, setFiles] = useState<FileItem[]>([]);

    // useEffect(() => {
    //     const prompt = localStorage.getItem("prompt");
    //     setPrompt(prompt as string)
    // }, [])


    useEffect(() => {
        let originalFiles = [...files];
        let updateHappened = false;
        steps.filter(({ status }) => status === "pending").map(step => {
            updateHappened = true;
            if (step?.type === StepType.CreateFile) {
                let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
                let currentFileStructure = [...originalFiles]; // {}
                let finalAnswerRef = currentFileStructure;

                let currentFolder = ""
                while (parsedPath.length) {
                    currentFolder = `${currentFolder}/${parsedPath[0]}`;
                    let currentFolderName = parsedPath[0];
                    parsedPath = parsedPath.slice(1);

                    if (!parsedPath.length) {
                        // final file
                        let file = currentFileStructure.find(x => x.path === currentFolder)
                        if (!file) {
                            currentFileStructure.push({
                                name: currentFolderName,
                                type: 'file',
                                path: currentFolder,
                                content: step.code
                            })
                        } else {
                            file.content = step.code;
                        }
                    } else {
                        /// in a folder
                        let folder = currentFileStructure.find(x => x.path === currentFolder)
                        if (!folder) {
                            // create the folder
                            currentFileStructure.push({
                                name: currentFolderName,
                                type: 'folder',
                                path: currentFolder,
                                children: []
                            })
                        }

                        currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
                    }
                }
                originalFiles = finalAnswerRef;
            }

        })

        if (updateHappened) {

            setFiles(originalFiles)
            setSteps(steps => steps.map((s: Step) => {
                return {
                    ...s,
                    status: "completed"
                }

            }))
        }
        // console.log(files);
    }, [steps, files]);


    useEffect(() => {
        const createMountStructure = (files: FileItem[]): Record<string, any> => {
            const mountStructure: Record<string, any> = {};

            const processFile = (file: FileItem, isRootFolder: boolean) => {
                if (file.type === 'folder') {
                    // For folders, create a directory entry
                    mountStructure[file.name] = {
                        directory: file.children ?
                            Object.fromEntries(
                                file.children.map(child => [child.name, processFile(child, false)])
                            )
                            : {}
                    };
                } else if (file.type === 'file') {
                    if (isRootFolder) {
                        mountStructure[file.name] = {
                            file: {
                                contents: file.content || ''
                            }
                        };
                    } else {
                        // For files, create a file entry with contents
                        return {
                            file: {
                                contents: file.content || ''
                            }
                        };
                    }
                }

                return mountStructure[file.name];
            };

            // Process each top-level file/folder
            files.forEach(file => processFile(file, true));

            return mountStructure;
        };

        const mountStructure = createMountStructure(files);

        // Mount the structure if WebContainer is available
        // console.log(mountStructure);
        webcontainer?.mount(mountStructure);
    }, [files, webcontainer]);

    async function init() {
        const chatResponse = localStorage.getItem("chatResponse")
        const templateResponse = localStorage.getItem("templateResponse")

        setChatHistory([{
            type: "text",
            role: "user",
            text: (localStorage.getItem("prompt")!).trim(),
            createdAt: Date.now()
        }])

        // setPrompt(localStorage.getItem("prompt") as string)
        const response = await axios.post(`/api/template`, {
            // msg: prompt.trim()
            msg: (localStorage.getItem("prompt")!).trim()
        });
        setTemplateSet(true);
        localStorage.setItem("templateResponse", JSON.stringify(response))


        // console.log("response.data 168 ---", response.data);

        const { prompts, uiPrompts } = response.data;

        // console.log("uiPrompts parseXmlChat() /api/template \n", parseXmlChat(uiPrompts[0], "initial setup of project"));


        // console.log("response.data 172 ---", [...prompts, ...uiPrompts, localStorage.getItem("prompt")!].map(content => ({
        //     role: "user",
        //     content
        // })));

        setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
            ...x,
            status: "pending"
        })));

        setLoading(true);
        const stepsResponse = await axios.post(`/api/chat`, {
            messages: [...prompts, ...uiPrompts, localStorage.getItem("prompt")!].map(content => ({
                role: "user",
                content
            }))
        })!

        localStorage.setItem("chatResponse", JSON.stringify(stepsResponse))

        // if(!stepsResponse && stepsResponse.data) return
        const chatRouteRes = stepsResponse.data.response
        // setChatHistory(e => [...e, ...parseXmlChat(uiPrompts[0], "initial setup of project")])


        setChatHistory(e => {
            const isInitialSetupExists = e.some(f =>
                f.role === "assistant" &&
                f.type === "files"
                // f.text === "initial setup of project"
            )

            const msg = !isInitialSetupExists ?
                "initial setup of project" : "changing file or editing files"
            return [
                ...e,
                parseXmlChat(chatRouteRes)[0],
                ...parseXmlChat(uiPrompts[0], msg),
                parseXmlChat(chatRouteRes)[1],
            ]
        })

        // setFiles(parseXmlChat(chatRouteRes)[1])

        setLoading(false);

        // console.log("stepsResponse parseXmlChat() /api/chat \n", parseXmlChat(stepsResponse.data.response));

        setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
            ...x,
            status: "pending" as "pending"
        }))]);

        const llmMsg = [
            ...[...prompts, prompt].map((content: string) => ({
                role: "user",
                content 
            })),
            { role: "assistant", content: stepsResponse.data.response as string}
        ]

        localStorage.setItem("llmMsg", JSON.stringify(llmMsg))

        setLlmMessages([...prompts, prompt].map(content => ({
            role: "user",
            content
        })));

        setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }])


        console.log("llmMessages 257 --", llmMessages)
    }

    useEffect(() => {
        setPrompt(localStorage.getItem("prompt") as string)
        init();
        console.log("llmMessages 262 --", llmMessages)
    }, [])

    const sendBtnHandle = async (msg: PromptInputMessage) => {
        console.log("llmMessages 265 --", llmMessages)
        const newMessage: ChatMessage = {
            role: "user" as "user",
            content: msg.text
            // content: userPrompt
        };
        setChatHistory(e => [
            ...e,
            {
                type: "text",
                role: "user",
                text: msg.text.trim(),
                createdAt: Date.now()
            }
        ])

        setLoading(true);

        const llmMsg: ChatMessage[] = JSON.parse(localStorage.getItem("llmMsg") || "[]")
       
        const stepsResponse = await axios.post(`/api/chat`, {
            // messages: [...llmMessages, newMessage]
            messages: [...llmMsg.slice(0, 6), newMessage]
        });
        setLoading(false);

        setLlmMessages(x => [...x, newMessage]);

        setLlmMessages(x => [...x, {
            role: "assistant",
            content: stepsResponse.data.response
        }]);
        const newllmMsg = [
            ...llmMsg,
            newMessage,
            { role: "assistant", content: stepsResponse.data.response }
        ]

        localStorage.setItem("llmMsg", JSON.stringify(newllmMsg))

        setChatHistory(e => [
            ...e,
            ...parseXmlChat(stepsResponse.data.response),
        ])

        setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
            ...x,
            status: "pending" as "pending"
        }))]);

    }

    // console.log("files ---", files)
    return (
        <div className="relative min-h-screen flex flex-col bg-orange-800/5 overflow-hidden">

            {/* // header  */}
            <div className="px-3 py-1.5 flex ">
                <div className={cn("w-72")}>
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-pink-500">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Bolt.new
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="">
                    <TabView activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {/* <div className="h-full grid grid-cols-12 gap-6 p-3"> */}
                <div className="h-full flex gap-2 px-2">
                    <div className="w-full max-w-[27vw] space-y-6 overflow-auto scrollbar-none">
                        <div className='max- h-[71vh]'>
                            <ScrollArea className="min-h-[50vh] h-full lg:max-h-[87vh] overflow-y-scroll scrollbar-none">
                                <StepsList
                                    // steps={steps}
                                    steps={chatHistory}
                                // currentStep={currentStep}
                                // onStepClick={setCurrentStep}
                                />
                            </ScrollArea>
                            {/* // prompt section */}
                            <div className='sticky bottom-0'>
                                <PromptInputBox
                                    submitFc={(e: PromptInputMessage) => sendBtnHandle(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full max-w-[73vw] bg-gray-900/40 border border-gray-800/70 rounded-sm overflow-hidden">
                        {activeTab === 'code' ? (<>
                            <ScrollArea className="h-[90vh] min-w-60 border-r">
                                <FileExplorer
                                    files={[...files].sort((a, b) => {
                                        if (a.type !== b.type) {
                                            return a.type === 'folder' ? -1 : 1;
                                        }
                                        return a.name.localeCompare(b.name);
                                    })}
                                    onFileSelect={setSelectedFile}
                                />
                            </ScrollArea>
                            <div className="w-full h-[90vh]">
                                <CodeEditor file={selectedFile} />
                            </div>
                        </>) : (
                            <PreviewFrame webContainer={webcontainer!} files={files} />
                            // <div className=""></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page