"use client"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className=" flex bg-linear-to-b from-orange-500/10 via-transparent to-orange-500/5 dark:from-orange-500/5 min-h-svh flex-col items-center justify-center gap-6  p-6 md:pt-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* <AnimatedBackground /> */}
        <SignupForm />
      </div>
    </div>
  )
}
