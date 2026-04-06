import React, { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown, EllipsisVertical, Download } from 'lucide-react';
import { FileExplorerProps, FileItem } from '../types';
import { downloadProject } from '@/utils/downloadProject';
import FileNode from './FileNode';
import { DownloadDialog } from './DownloadDialog';





export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const [open, setOpen] = useState(false);


  // console.log("files 67 from file explorer", files)  
  return (
    <div className="relative  p-4 h-full overflow-auto">
      <div className="flex justify-between items-center sticky top-0">
        <h2 className=" font-semibold mb-1 flex items-center gap-2 text-gray-100">
          <FolderTree className="w-4 h-4" />
          File 
          {/* Explorer */}
        </h2>
        <button className='mt-2' onClick={() => setOpen(true)}>
          <Download className="w-4 h-4 hover:bg-black/20 -mt-3 text-white" />
        </button>
      </div>
      <div className="space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
      {/* Dialog */}
      <DownloadDialog
        open={open}
        onOpenChange={setOpen}
        files={files}
      />
    </div>
  );
}