"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"
import TerminalInterface from "@/components/terminal-interface"

export default function TerminalToggle() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const toggleTerminal = () => {
    setIsTerminalOpen((prev) => !prev)
  }

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev)
  }

  return (
    <>
      <Button
        variant="outline"
        className="border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066]/10"
        onClick={toggleTerminal}
      >
        <Terminal className="w-4 h-4 mr-2" />
        Terminal
      </Button>

      <TerminalInterface
        isOpen={isTerminalOpen}
        onClose={toggleTerminal}
        fullScreen={isFullScreen}
        onToggleFullScreen={toggleFullScreen}
      />
    </>
  )
}
