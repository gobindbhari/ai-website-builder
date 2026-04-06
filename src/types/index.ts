export enum StepType {
  CreateFile = "CreateFile",
  CreateFolder = "CreateFolder",
  EditFile = "EditFile",
  DeleteFile = "DeleteFile",
  RunScript = "RunScript"
}

export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string;
  path?: string;
}
export interface StepFiles {
  title: string;
  description?: string;
  type: StepType;
  code?: string;
  path?: string;
}

export interface Project {
  prompt: string;
  steps: Step[];
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}

export interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

export interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}


// export interface chatHistory {
//   files: FileItem[]
//   text: string
// } 

interface TextChatHistory {
  role: "user" | "assistant",
  type: "text";
  text: string;     
  createdAt: number;
}

interface FileChatHistory {
  role: "assistant",
  type: "files";
  files: FileItem[];
  createdAt: number;
}

export type ChatHistory = TextChatHistory | FileChatHistory

// export interface ChatHistory {
//   type: "text" | "files"
//   files?: FileItem[]
//   text?: string
//   createdAt: number
// } 

export interface Files {
  
}