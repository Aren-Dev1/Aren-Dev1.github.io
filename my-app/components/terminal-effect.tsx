"use client"

import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"

export default function TerminalEffect() {
  const [text, setText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const commands = [
      "nmap -sS -sV -p- 192.168.1.0/24",
      "Running port scan...",
      "Discovered open ports: 22, 80, 443, 3389",
      "Identifying services...",
      "PORT    STATE SERVICE     VERSION",
      "22/tcp  open  ssh         OpenSSH 8.2p1",
      "80/tcp  open  http        nginx 1.18.0",
      "443/tcp open  https       nginx 1.18.0",
      "3389/tcp open rdp         Microsoft Terminal Services",
      "Vulnerability scan initiated...",
      "CVE-2021-44228 detected (Log4Shell)",
      "CVE-2022-22965 detected (Spring4Shell)",
      "Generating report...",
      "Scan complete. 2 critical vulnerabilities found.",
    ]

    let commandIndex = 0
    let charIndex = 0

    const typeWriter = () => {
      if (commandIndex < commands.length) {
        if (charIndex < commands[commandIndex].length) {
          setText((prev) => prev + commands[commandIndex][charIndex])
          charIndex++
          setTimeout(typeWriter, Math.random() * 50 + 20)
        } else {
          setText((prev) => prev + "\n")
          commandIndex++
          charIndex = 0
          setTimeout(typeWriter, Math.random() * 500 + 200)
        }
      }
    }

    typeWriter()

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4 text-[#ff0066]" />
        <span>SECURITY_SCAN.sh</span>
      </div>
      <pre className="whitespace-pre-wrap text-green-500">
        {text}
        {cursorVisible && <span className="animate-pulse">_</span>}
      </pre>
    </div>
  )
}
