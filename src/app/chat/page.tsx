"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { AlertBox } from "@/components/AlertBox";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();
  const { data: session } = authClient.useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setIsLoading(true)
    if (!session) {
      setOpen(true);
      return;
    }
    if (!prompt.trim()) return toast.warning("Please enter prompt")

    localStorage.setItem("prompt", prompt);
    router.push("/builder")
    // router.push("/new-builder")

  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-orange-500/10 via-transparent to-transparent"></div>

      {/* Glow effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      {/* Content */}
      <div className="relative max-w-3xl w-full text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 mb-6"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-400">
            AI Website Builder
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-bold mb-4"
        >
          Build Websites
          <br />
          <span className="bg-linear-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            With Just a Prompt
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400 mb-8"
        >
          Describe your idea and generate full-stack websites instantly using AI.
        </motion.p>

        {/* Prompt Box */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-xl p-4 shadow-xl"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website idea... (e.g. SaaS landing page with pricing, auth, dashboard)"
            className="w-full h-28 p-3 bg-transparent text-gray-100 outline-none resize-none placeholder-gray-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all"
          >
            {isLoading ?
              <><Loader className="animate-spin" /> Generating Website ... </>
              :
              <><ArrowRight className="w-4 h-4" /> Generate Website</>
            }

          </button>
        </motion.form>
      </div>

      <AlertBox
        open={open}
        setOpen={setOpen}
        heading="Sign in required"
        description="You need to sign in first"
        continueFc={() => router.push("/signin")}
      />
    </section>
  );
}