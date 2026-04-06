import React, { useEffect, useRef } from 'react';
import { CheckCircle, Circle, Clock, File, Loader2, PenBoxIcon, Zap } from 'lucide-react';
import { ChatHistory, Step } from '../types';
import { cn } from '@/lib/utils';
import { isMarkdown } from '@/utils/common';
import ReactMarkdown from "react-markdown"; // ✅ default export


interface StepsListProps {
  // steps: Step[];
  steps: ChatHistory[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {

  const containerRef = useRef<HTMLDivElement | null>(null);

  // const sortedSteps = steps.sort((a, b) => a.createdAt - b.createdAt);
  const sortedSteps = [...steps]
    .filter(step => step != null)
    .sort((a, b) => (a?.createdAt || 0) - (b?.createdAt || 0))

  const seenFiles = new Set<string>();

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(steps))
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight; // ✅ go to bottom
    console.log("chatHistory 34 ---", JSON.parse(localStorage.getItem("chatHistory") as string))
  }, [steps]);


  return (
    <div ref={containerRef} className="bg-gray-900/40 rounded-lg shadow-lg p-4 h-full overflow-auto scrollbar-none">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Build Steps</h2>
      <div className="space-y-2 text-sm font-light">
        {sortedSteps.map((step, idx) => {
          if (!step) return null;
          const prevStep = sortedSteps[idx - 1];

          // console.log("step", step)
          const isPreFile = prevStep?.type === "files";
          const isPrevUser = prevStep?.role === "user";

          return (
            step.role === "user" ?
              <div key={idx} className={cn(!isPrevUser && "mt-8", "max-w-[95%] w-fit ml-auto bg-gray-800 py-1 px-2 rounded-sm border border-white/50")}>
                {isMarkdown(step.text) ?
                  <ReactMarkdown >
                    {step.text}
                  </ReactMarkdown>
                  :
                  step.text}
              </div>
              :
              step.type === "text" ?
                <>
                  {isPrevUser && <div className="flex items-center justify-center w-6 h-6 rounded-sm  bg-linear-to-br from-orange-500 to-pink-500">
                    <Zap className="w-4 h-4 text-white" />
                  </div>}
                  <div key={idx} className="max-w-[95%] bg-gray-900 p-1 rounded-sm border border-white/15">
                    {isMarkdown(step.text) ?
                      <ReactMarkdown >
                        {step.text}
                      </ReactMarkdown>
                      :
                      step.text}
                  </div>
                </>
                :
                <div key={idx} className={cn(isPreFile && "-mt-6", " bg-gray-800 p-2 ml-5 max-w-[85%] flex flex-col")}>
                  {step.files.map((f, i) => {
                    const fileKey = f.path || f.name;

                    const isEdit = seenFiles.has(fileKey);

                    // mark as seen AFTER checking
                    seenFiles.add(fileKey);

                    return (f.path || f.name) && <div key={i * idx} className={cn("flex items-center gap-1 text-xs font-extralight")}>
                      <PenBoxIcon color='gray' className='w-3 h-3' />
                      {isEdit ? "edited -" : "created -"} {f.path}
                      {/* {isEdit ? "edited -" : "created -"} {f.name} */}
                    </div>
                  })}
                </div>
          )
        })}
      </div>
    </div>
  );
}

/**
 * {steps.map((step, idx) => (
          <div
            key={idx}
            className={`p-1 rounded-lg cursor-pointer transition-colors ${
              currentStep === step.id
                ? 'bg-gray-800 border border-gray-700'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-center gap-2">
              {step.status === 'completed' ? (
                <CheckCircle className="min-w-4 max-w-4 min-h-4 max-h-4 text-green-500" />
              ) : step.status === 'in-progress' ? (
                // <Clock className="w-5 h-5 text-blue-400" />
                <Loader2 className="animate-spin min-w-4 max-w-4 min-h-4 max-h-4 text-blue-400" />
              ) : (
                <Circle className="min-w-4 max-w-4 min-h-4 max-h-4 text-gray-600" />
              )}
              <h3 className="font-medium text-xs text-gray-100">{step.title}</h3>
            </div>
            <p className="text-xs text-gray-400 mt-2">{step.description}</p>
          </div>
        ))}
 */