"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
}

export default function GlitchText({ text, className }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 100)
      },
      Math.random() * 5000 + 2000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <span className={cn("relative inline-block", className)}>
      <span>{text}</span>

      {isGlitching && (
        <>
          <span className="absolute left-0 top-0 text-[#ff0066] opacity-80 translate-x-[1px] translate-y-[-1px]">
            {text}
          </span>
          <span className="absolute left-0 top-0 text-[#00ffff] opacity-80 translate-x-[-1px] translate-y-[1px]">
            {text}
          </span>
        </>
      )}
    </span>
  )
}
