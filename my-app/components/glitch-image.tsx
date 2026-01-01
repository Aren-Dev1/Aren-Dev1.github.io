"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GlitchImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function GlitchImage({ src, alt, width, height, className }: GlitchImageProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150)
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="w-full h-auto" />

      {isGlitching && (
        <>
          <div className="absolute inset-0 bg-[#ff0066] mix-blend-screen opacity-30"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="glitch-slice"></div>
            <div className="glitch-slice"></div>
            <div className="glitch-slice"></div>
          </div>
        </>
      )}
    </div>
  )
}
