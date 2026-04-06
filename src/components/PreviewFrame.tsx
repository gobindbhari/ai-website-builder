"use client"

import type { WebContainer } from '@webcontainer/api';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Shimmer } from "@/components/ai-elements/shimmer";

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  async function main() {
    // if (!webContainer) return;  // defensive check

    const installProcess = await webContainer.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log("data.toString()");
        console.log(data.toString());
      }
    }));

    await webContainer.spawn('npm', ['run', 'dev']);

    // Wait for `server-ready` event
    webContainer.on('server-ready', (port, url) => {
      // ...
      console.log(url)
      console.log(port)
      setUrl(url);
    });
  }

  useEffect(() => {
    // if (!webContainer) return;  // defensive check
    main()
  }, [])
  return (
    <div className="h-full w-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center w-64 flex flex-col items-center">
        <p className="mb-2  flex items-center gap-2">
          <Loader2 className='animate-spin'/> 
          <Shimmer>Loading...</Shimmer>
        </p>
        <Shimmer>
        It can take a few moments, so please wait until it finishes.
        </Shimmer>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}