import React, { useState } from 'react';
import { FileItem } from '../types';
import { downloadProject } from '@/utils/downloadProject';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: FileItem[];
}

export function DownloadDialog({ open, onOpenChange, files }: DownloadDialogProps) {
  const [projectName, setProjectName] = useState('');

  const handleDownload = () => {
    if (!projectName.trim()) return;

    downloadProject(files, projectName);
    onOpenChange(false);
    setProjectName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Project</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Enter project name (e.g. my-app)"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}