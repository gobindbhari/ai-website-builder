import { ChatHistory, FileItem, Step, StepFiles, StepType } from "@/types";


/*
 * Parse input XML and convert it into steps.
 * Eg: Input - 
 * <boltArtifact id=\"project-import\" title=\"Project Files\">
 *  <boltAction type=\"file\" filePath=\"eslint.config.js\">
 *      import js from '@eslint/js';\nimport globals from 'globals';\n
 *  </boltAction>
 * <boltAction type="shell">
 *      node index.js
 * </boltAction>
 * </boltArtifact>
 * 
 * Output - 
 * [{
 *      title: "Project Files",
 *      status: "Pending"
 * }, {
 *      title: "Create eslint.config.js",
 *      type: StepType.CreateFile,
 *      code: "import js from '@eslint/js';\nimport globals from 'globals';\n"
 * }, {
 *      title: "Run command",
 *      code: "node index.js",
 *      type: StepType.RunScript
 * }]
 * 
 * The input can have strings in the middle they need to be ignored
 */

export function parseXml(response: string): Step[] {
  // Extract the XML content between <boltArtifact> tags
  // console.log("response.split(<boltArtifact)", response.split("<boltArtifact"))
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);

  // console.log("xmlMatch 37", xmlMatch)

  if (!xmlMatch) {
    return [];
  }

  // console.log("xmlMatch[0]", xmlMatch[0])
  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  // Extract artifact title
  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  // Add initial artifact step
  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: '',
    type: StepType.CreateFolder,
    status: 'pending'
  });

  // Regular expression to find boltAction elements
  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    if (type === 'file') {
      const cleanCode = content
        .replace(/```[a-zA-Z]*\n?/g, '')
        .replace(/```/g, '')
        .trim();

      // File creation step
      steps.push({
        id: stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        code: cleanCode,
        path: filePath
      });
    } else if (type === 'shell') {
      // Shell command step
      steps.push({
        id: stepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'pending',
        code: content.trim()
      });
    }
  }

  return steps;
}


export function parseXmlChat(response: string, msg?: string): ChatHistory[] {
  const chatsteps: ChatHistory[] = []

  // console.log("response ", response)

  const chat = response.split("<boltArtifact");
  chatsteps.push({
    role: "assistant",
    type: "text",
    text: chat[0]?.trim() ? chat[0] : msg!,
    createdAt: Date.now(),
  })
  // chatsteps[0].text = chat[0]

  // Extract the XML content between <boltArtifact> tags
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);

  if (!xmlMatch) {
    return chatsteps;
  }

  const projectFiles = xmlMatch[0].matchAll(/<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g)

  const filePathArray: FileItem[] = []

  projectFiles.forEach((e) => {
    const path = e[2] ?? "";
    filePathArray.push({
      name: path.includes("/") ? path.split("/").pop()! : path,
      type: e[1] as ('file' | 'folder'),
      path: e[2],
      content: e[3],
    })
  });

  chatsteps.push({
    role: "assistant",
    type: "files",
    files: filePathArray,
    createdAt: Date.now(),
  })

  // console.log("chatsteps", chatsteps)

  return chatsteps;
}

export function parseXmlFiles(response: string): StepFiles[] {
  // Extract the XML content between <boltArtifact> tags

  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);

  // console.log("xmlMatch 37", xmlMatch)

  if (!xmlMatch) {
    return [];
  }

  // console.log("xmlMatch[0]", xmlMatch[0])
  const xmlContent = xmlMatch[1];
  const steps: StepFiles[] = [];
  let stepId = 1;

  // Extract artifact title
  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  // Add initial artifact step
  // steps.push({
  //   title: artifactTitle,
  //   description: '',
  //   type: StepType.CreateFolder,
  // });

  // Regular expression to find boltAction elements
  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    if (type === 'file') {
      const cleanCode = content
        .replace(/```[a-zA-Z]*\n?/g, '')
        .replace(/```/g, '')
        .trim();

      // File creation step
      steps.push({
        // title: `Create ${filePath || 'file'}`,
        title: filePath.split("/").pop() || filePath,
        // description: '',
        type: StepType.CreateFile,
        code: cleanCode,
        path: filePath
      });
    } else if (type === 'shell') {
      // Shell command step
      steps.push({
        title: 'Run command',
        // description: '',
        type: StepType.RunScript,
        code: content.trim()
      });
    }
  }

  return steps;
}