"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { TerminalIcon, X, Minimize2, Maximize2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fileSystem } from "@/lib/terminal-filesystem"
import { ctfChallenges, getChallengeById, getChallengesByCategory, type CTFChallenge } from "@/lib/ctf-challenges"

interface TerminalProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
  fullScreen?: boolean
  onToggleFullScreen?: () => void
}

interface TerminalEntry {
  type: "command" | "response" | "error" | "welcome" | "ascii" | "ctf-success" | "ctf-fail" | "ctf-info"
  content: string
}

const helperCommands = [
  { cmd: "help", desc: "Show available commands" },
  { cmd: "ls", desc: "List directory contents" },
  { cmd: "cd <dir>", desc: "Change directory" },
  { cmd: "cat <file>", desc: "Show file contents" },
  { cmd: "clear", desc: "Clear terminal" },
  { cmd: "whoami", desc: "Display user info" },
  { cmd: "skills", desc: "List security skills" },
  { cmd: "projects", desc: "List security projects" },
  { cmd: "contact", desc: "Contact information" },
  { cmd: "hack <target>", desc: "Attempt to hack a target" },
  { cmd: "nmap <ip>", desc: "Scan network" },
  { cmd: "ctf", desc: "Capture The Flag challenges" },
  { cmd: "exit", desc: "Close terminal" },
]

// ASCII art for the welcome message
const asciiArt = `
     _____       _  _____         
    |  __ \\     | |/ ____|        
    | |  | | ___| | (___   ___  ___ 
    | |  | |/ _ \\ |\\___ \\ / _ \\/ __|
    | |__| |  __/ |____) |  __/ (__ 
    |_____/ \\___|_|_____/ \\___|\\___|
                                  
    =================================
    >> Terminal v1.3.37 // SECURED <<
    =================================
`

const welcomeMessage = `Type 'help' to see available commands.`

// ASCII art for CTF mode
const ctfAsciiArt = `
    ██████╗████████╗███████╗
   ██╔════╝╚══██╔══╝██╔════╝
   ██║        ██║   █████╗  
   ██║        ██║   ██╔══╝  
   ╚██████╗   ██║   ██║     
    ╚═════╝   ╚═╝   ╚═╝     
                           
   CAPTURE THE FLAG CHALLENGES
   ===========================
`

export default function TerminalInterface({
  isOpen = false,
  onClose,
  className,
  fullScreen = false,
  onToggleFullScreen,
}: TerminalProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { type: "ascii", content: asciiArt },
    { type: "welcome", content: welcomeMessage },
  ])
  const [inputValue, setInputValue] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDirectory, setCurrentDirectory] = useState("/")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [ctfProgress, setCTFProgress] = useState<{
    solvedChallenges: string[]
    points: number
    currentHints: Record<string, number>
  }>({
    solvedChallenges: [],
    points: 0,
    currentHints: {},
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalOutputRef = useRef<HTMLDivElement>(null)

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Auto scroll to bottom when new entries are added
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight
    }
  }, [entries])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (fullScreen) return
    if ((e.target as HTMLElement).classList.contains("terminal-drag-handle")) {
      setIsDragging(true)
      const rect = terminalRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (isDragging && terminalRef.current) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      setPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove as any)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove as any)
      window.removeEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const getFolderContents = (path: string) => {
    const parts = path.split("/").filter(Boolean)
    let current = fileSystem

    for (const part of parts) {
      if (current.type !== "directory" || !current.children) {
        return null
      }
      const child = current.children.find((c) => c.name === part)
      if (!child) {
        return null
      }
      current = child
    }

    if (current.type !== "directory" || !current.children) {
      return null
    }

    return current.children
  }

  const getFileContent = (path: string) => {
    // Handle absolute paths
    if (path.startsWith("/")) {
      const parts = path.split("/").filter(Boolean)
      let current = fileSystem

      for (const part of parts) {
        if (current.type !== "directory" || !current.children) {
          return null
        }
        const child = current.children.find((c) => c.name === part)
        if (!child) {
          return null
        }
        current = child
      }

      if (current.type !== "file" || !current.content) {
        return null
      }

      return current.content
    }

    // Handle relative paths
    const currentPathParts = currentDirectory.split("/").filter(Boolean)
    const pathParts = path.split("/").filter(Boolean)

    let current = fileSystem
    const parts = [...currentPathParts]

    for (const part of pathParts) {
      if (part === "..") {
        parts.pop()
      } else if (part !== ".") {
        parts.push(part)
      }
    }

    for (const part of parts) {
      if (current.type !== "directory" || !current.children) {
        return null
      }
      const child = current.children.find((c) => c.name === part)
      if (!child) {
        return null
      }
      current = child
    }

    if (current.type !== "file" || !current.content) {
      return null
    }

    return current.content
  }

  const resolvePath = (path: string) => {
    if (path.startsWith("/")) {
      return path
    }

    const currentParts = currentDirectory.split("/").filter(Boolean)
    const newParts = path.split("/").filter(Boolean)
    const resultParts = [...currentParts]

    for (const part of newParts) {
      if (part === "..") {
        if (resultParts.length > 0) {
          resultParts.pop()
        }
      } else if (part !== ".") {
        resultParts.push(part)
      }
    }

    return "/" + resultParts.join("/")
  }

  const isValidDirectory = (path: string) => {
    const parts = path.split("/").filter(Boolean)
    let current = fileSystem

    for (const part of parts) {
      if (current.type !== "directory" || !current.children) {
        return false
      }
      const child = current.children.find((c) => c.name === part)
      if (!child) {
        return false
      }
      current = child
    }

    return current.type === "directory"
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle up/down arrow keys for command history
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex])
      } else {
        setHistoryIndex(-1)
        setInputValue("")
      }
    }

    // Handle command submission
    if (e.key === "Enter") {
      e.preventDefault()
      const trimmedInput = inputValue.trim()

      if (trimmedInput) {
        // Add command to history
        setCommandHistory((prev) => [...prev, trimmedInput])
        setHistoryIndex(-1)

        // Display command in terminal
        setEntries((prev) => [...prev, { type: "command", content: `${currentDirectory} $ ${trimmedInput}` }])

        // Process command
        processCommand(trimmedInput)

        // Clear input
        setInputValue("")
      }
    }
  }

  // Function to simulate network scan result
  const simulateScan = (ip: string) => {
    const ports = [
      { port: 22, service: "SSH", status: "open" },
      { port: 80, service: "HTTP", status: "open" },
      { port: 443, service: "HTTPS", status: "open" },
      { port: 3389, service: "RDP", status: Math.random() > 0.5 ? "open" : "filtered" },
      { port: 21, service: "FTP", status: Math.random() > 0.7 ? "open" : "closed" },
    ]

    const result = [
      `Starting Nmap scan for ${ip}...`,
      `Scanning ${ports.length} ports...`,
      "",
      "PORT     STATE    SERVICE",
    ]

    ports.forEach(({ port, service, status }) => {
      result.push(`${port}/tcp  ${status.padEnd(8)} ${service}`)
    })

    return result.join("\n")
  }

  // Function to simulate a hacking attempt
  const simulateHack = (target: string) => {
    const steps = [
      `Targeting ${target}...`,
      "Checking for vulnerabilities...",
      "Found potential entry points...",
      "Attempting exploit...",
    ]

    const successMessages = [
      `Successfully compromised ${target}!`,
      `Access granted to ${target} systems.`,
      `${target} security bypassed.`,
    ]

    const failMessages = [
      `Access to ${target} denied!`,
      `${target} security measures blocked the attempt.`,
      `Failed to breach ${target} defenses.`,
    ]

    const result = [...steps]

    // 50% chance of success
    if (Math.random() > 0.5) {
      result.push(successMessages[Math.floor(Math.random() * successMessages.length)])
    } else {
      result.push(failMessages[Math.floor(Math.random() * failMessages.length)])
    }

    return result.join("\n")
  }

  // CTF command handler
  const handleCTFCommand = (args: string[]) => {
    if (args.length === 0 || args[0] === "help") {
      setEntries((prev) => [
        ...prev,
        { type: "ascii", content: ctfAsciiArt },
        {
          type: "response",
          content:
            "CTF Commands:\n\n" +
            "ctf list [category] [difficulty]  - List all challenges or filter by category/difficulty\n" +
            "ctf info <challenge_id>           - Show details about a specific challenge\n" +
            "ctf solve <challenge_id> <flag>   - Submit a flag for a challenge\n" +
            "ctf hint <challenge_id>           - Get a hint for a challenge\n" +
            "ctf status                        - Show your current progress\n" +
            "ctf categories                    - List available challenge categories\n" +
            "ctf difficulties                  - List available difficulty levels\n\n" +
            "Start by typing 'ctf list' to see available challenges!",
        },
      ])
      return
    }

    const subCommand = args[0].toLowerCase()

    switch (subCommand) {
      case "list":
        let challenges = [...ctfChallenges]
        let filterMessage = ""

        // Filter by category if provided
        if (args[1] && args[1] !== "all") {
          const category = args[1].toLowerCase() as CTFChallenge["category"]
          challenges = getChallengesByCategory(category)
          filterMessage += ` in category '${category}'`
        }

        // Filter by difficulty if provided
        if (args[2] && args[2] !== "all") {
          const difficulty = args[2].toLowerCase() as CTFChallenge["difficulty"]
          challenges = challenges.filter((c) => c.difficulty === difficulty)
          filterMessage += ` with '${difficulty}' difficulty`
        }

        // Mark solved challenges
        challenges = challenges.map((challenge) => ({
          ...challenge,
          solved: ctfProgress.solvedChallenges.includes(challenge.id),
        }))

        const challengeList = challenges
          .map((challenge) => {
            const status = challenge.solved ? "[SOLVED]" : "[UNSOLVED]"
            const statusColor = challenge.solved ? "\x1b[32m" : "\x1b[33m" // Green for solved, yellow for unsolved
            return `${statusColor}${status}\x1b[0m [${challenge.category.toUpperCase()}] [${challenge.difficulty.toUpperCase()}] ${challenge.id}: ${challenge.title} (${challenge.points} pts)`
          })
          .join("\n")

        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content:
              challenges.length > 0
                ? `Available challenges${filterMessage}:\n\n${challengeList}`
                : `No challenges found${filterMessage}.`,
          },
        ])
        break

      case "info":
        if (args.length < 2) {
          setEntries((prev) => [
            ...prev,
            { type: "error", content: "Please specify a challenge ID. Usage: ctf info <challenge_id>" },
          ])
          return
        }

        const challengeId = args[1]
        const challenge = getChallengeById(challengeId)

        if (!challenge) {
          setEntries((prev) => [...prev, { type: "error", content: `Challenge with ID '${challengeId}' not found.` }])
          return
        }

        const isSolved = ctfProgress.solvedChallenges.includes(challengeId)
        const statusText = isSolved ? "\x1b[32m[SOLVED]\x1b[0m" : "\x1b[33m[UNSOLVED]\x1b[0m"

        setEntries((prev) => [
          ...prev,
          {
            type: "ctf-info",
            content:
              `${statusText} Challenge: ${challenge.title}\n` +
              `ID: ${challenge.id}\n` +
              `Category: ${challenge.category.toUpperCase()}\n` +
              `Difficulty: ${challenge.difficulty.toUpperCase()}\n` +
              `Points: ${challenge.points}\n\n` +
              `${challenge.description}\n\n` +
              `Use 'ctf hint ${challengeId}' to get a hint if you're stuck.`,
          },
        ])
        break

      case "solve":
        if (args.length < 3) {
          setEntries((prev) => [
            ...prev,
            {
              type: "error",
              content: "Please specify a challenge ID and flag. Usage: ctf solve <challenge_id> <flag>",
            },
          ])
          return
        }

        const solveId = args[1]
        const submittedFlag = args.slice(2).join(" ")
        const challengeToSolve = getChallengeById(solveId)

        if (!challengeToSolve) {
          setEntries((prev) => [...prev, { type: "error", content: `Challenge with ID '${solveId}' not found.` }])
          return
        }

        if (ctfProgress.solvedChallenges.includes(solveId)) {
          setEntries((prev) => [...prev, { type: "ctf-info", content: `You've already solved this challenge!` }])
          return
        }

        if (submittedFlag === challengeToSolve.flag) {
          // Update progress
          setCTFProgress((prev) => ({
            ...prev,
            solvedChallenges: [...prev.solvedChallenges, solveId],
            points: prev.points + challengeToSolve.points,
          }))

          setEntries((prev) => [
            ...prev,
            {
              type: "ctf-success",
              content:
                `🚩 FLAG CAPTURED! 🚩\n\n` +
                `Congratulations! You've successfully solved the "${challengeToSolve.title}" challenge!\n` +
                `+${challengeToSolve.points} points added to your score.\n\n` +
                `Your current score: ${ctfProgress.points + challengeToSolve.points} points\n` +
                `Challenges solved: ${ctfProgress.solvedChallenges.length + 1}/${ctfChallenges.length}`,
            },
          ])
        } else {
          setEntries((prev) => [
            ...prev,
            {
              type: "ctf-fail",
              content: `Incorrect flag. Try again or use 'ctf hint ${solveId}' to get a hint.`,
            },
          ])
        }
        break

      case "hint":
        if (args.length < 2) {
          setEntries((prev) => [
            ...prev,
            { type: "error", content: "Please specify a challenge ID. Usage: ctf hint <challenge_id>" },
          ])
          return
        }

        const hintId = args[1]
        const challengeForHint = getChallengeById(hintId)

        if (!challengeForHint) {
          setEntries((prev) => [...prev, { type: "error", content: `Challenge with ID '${hintId}' not found.` }])
          return
        }

        // Get current hint index for this challenge
        const currentHintIndex = ctfProgress.currentHints[hintId] || 0

        if (currentHintIndex >= challengeForHint.hints.length) {
          setEntries((prev) => [...prev, { type: "ctf-info", content: "No more hints available for this challenge." }])
          return
        }

        const hint = challengeForHint.hints[currentHintIndex]

        // Update hint index for next time
        setCTFProgress((prev) => ({
          ...prev,
          currentHints: {
            ...prev.currentHints,
            [hintId]: currentHintIndex + 1,
          },
        }))

        setEntries((prev) => [
          ...prev,
          {
            type: "ctf-info",
            content: `Hint ${currentHintIndex + 1}/${challengeForHint.hints.length}: ${hint}`,
          },
        ])
        break

      case "status":
        const solvedCount = ctfProgress.solvedChallenges.length
        const totalCount = ctfChallenges.length
        const progressPercentage = Math.round((solvedCount / totalCount) * 100)

        const categoryCounts: Record<string, { solved: number; total: number }> = {}

        // Initialize category counts
        ctfChallenges.forEach((challenge) => {
          if (!categoryCounts[challenge.category]) {
            categoryCounts[challenge.category] = { solved: 0, total: 0 }
          }
          categoryCounts[challenge.category].total++

          if (ctfProgress.solvedChallenges.includes(challenge.id)) {
            categoryCounts[challenge.category].solved++
          }
        })

        const categoryProgress = Object.entries(categoryCounts)
          .map(([category, counts]) => {
            const categoryPercentage = Math.round((counts.solved / counts.total) * 100)
            return `${category.toUpperCase()}: ${counts.solved}/${counts.total} (${categoryPercentage}%)`
          })
          .join("\n")

        setEntries((prev) => [
          ...prev,
          {
            type: "ctf-info",
            content:
              `CTF Progress Summary\n` +
              `===================\n\n` +
              `Total Score: ${ctfProgress.points} points\n` +
              `Challenges Solved: ${solvedCount}/${totalCount} (${progressPercentage}%)\n\n` +
              `Progress by Category:\n` +
              `${categoryProgress}`,
          },
        ])
        break

      case "categories":
        const categories = Array.from(new Set(ctfChallenges.map((c) => c.category)))
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content: `Available categories:\n\n${categories.map((c) => `- ${c}`).join("\n")}`,
          },
        ])
        break

      case "difficulties":
        const difficulties = Array.from(new Set(ctfChallenges.map((c) => c.difficulty)))
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content: `Available difficulty levels:\n\n${difficulties.map((d) => `- ${d}`).join("\n")}`,
          },
        ])
        break

      default:
        setEntries((prev) => [
          ...prev,
          { type: "error", content: `Unknown CTF subcommand: ${subCommand}. Type 'ctf help' for usage information.` },
        ])
    }
  }

  // Function to handle cookies command for CTF
  const handleCookiesCommand = () => {
    // Get all cookies
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim())

    if (cookies.length === 0 || cookies[0] === "") {
      setEntries((prev) => [...prev, { type: "response", content: "No cookies found." }])
      return
    }

    const cookieList = cookies
      .map((cookie) => {
        const [name, value] = cookie.split("=")
        return `${name} = ${value}`
      })
      .join("\n")

    setEntries((prev) => [...prev, { type: "response", content: `Cookies:\n\n${cookieList}` }])
  }

  // Function to handle view-source command for CTF
  const handleViewSourceCommand = () => {
    // Find HTML comments in the document
    const htmlContent = document.documentElement.outerHTML
    const commentRegex = /<!--([\s\S]*?)-->/g
    const comments = []
    let match

    while ((match = commentRegex.exec(htmlContent)) !== null) {
      comments.push(match[1].trim())
    }

    if (comments.length === 0) {
      setEntries((prev) => [...prev, { type: "response", content: "No HTML comments found in the source code." }])
      return
    }

    const commentsList = comments.map((comment, index) => `Comment ${index + 1}:\n${comment}`).join("\n\n")

    setEntries((prev) => [...prev, { type: "response", content: `HTML Comments in Source Code:\n\n${commentsList}` }])
  }

  // Function to handle curl command for CTF
  const handleCurlCommand = (url: string) => {
    if (url === "/api/secret") {
      // Simulate API response
      setTimeout(() => {
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content:
              `HTTP/1.1 200 OK\n` +
              `Content-Type: application/json\n` +
              `\n` +
              `{\n` +
              `  "message": "You found the secret API!",\n` +
              `  "flag": "DEDSEC{4P1_S3CR3TS_3XP0S3D}"\n` +
              `}`,
          },
        ])
      }, 500)
    } else {
      setEntries((prev) => [
        ...prev,
        {
          type: "response",
          content: `HTTP/1.1 404 Not Found\n\nEndpoint not found: ${url}`,
        },
      ])
    }
  }

  // Function to handle exif command for CTF
  const handleExifCommand = (path: string) => {
    if (path === "/challenges/forensics/secret.jpg") {
      // Simulate EXIF data
      setTimeout(() => {
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content:
              `EXIF data for secret.jpg:\n\n` +
              `File Name: secret.jpg\n` +
              `File Size: 1.2 MB\n` +
              `Image Width: 1920\n` +
              `Image Height: 1080\n` +
              `Camera Model: Canon EOS R5\n` +
              `Date Taken: 2023-05-15 14:32:47\n` +
              `GPS Coordinates: [REDACTED]\n` +
              `Comment: DEDSEC{M3T4D4T4_L34K}\n` +
              `Software: Adobe Photoshop 2023\n` +
              `Copyright: © DedSec 2023`,
          },
        ])
      }, 500)
    } else {
      setEntries((prev) => [...prev, { type: "error", content: `exif: cannot access '${path}': No such file` }])
    }
  }

  // Function to handle whois command for CTF
  const handleWhoisCommand = (domain: string) => {
    if (domain === "dedsec-ctf.com") {
      // Simulate WHOIS data
      setTimeout(() => {
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content:
              `WHOIS data for dedsec-ctf.com:\n\n` +
              `Domain Name: dedsec-ctf.com\n` +
              `Registry Domain ID: 2587493_DOMAIN_COM-VRSN\n` +
              `Registrar WHOIS Server: whois.registrar.com\n` +
              `Registrar URL: http://www.registrar.com\n` +
              `Updated Date: 2023-01-15T10:11:12Z\n` +
              `Creation Date: 2022-01-15T10:11:12Z\n` +
              `Registrar Registration Expiration Date: 2024-01-15T10:11:12Z\n` +
              `Registrar: REDACTED FOR PRIVACY\n` +
              `Registrar IANA ID: 1337\n` +
              `Registrar Abuse Contact Email: abuse@registrar.com\n` +
              `Registrar Abuse Contact Phone: +1.5555555555\n` +
              `Domain Status: clientTransferProhibited\n` +
              `Registry Registrant ID: FLAG-DEDSEC{WH01S_1NF0_L34K}\n` +
              `Registrant Name: REDACTED FOR PRIVACY\n` +
              `Registrant Organization: Privacy Protection Service\n` +
              `Registrant Street: REDACTED FOR PRIVACY\n` +
              `Registrant City: REDACTED FOR PRIVACY\n` +
              `Registrant State/Province: CA\n` +
              `Registrant Postal Code: REDACTED FOR PRIVACY\n` +
              `Registrant Country: US\n` +
              `Registrant Phone: REDACTED FOR PRIVACY\n` +
              `Registrant Email: Please query the RDDS service of the Registrar of Record`,
          },
        ])
      }, 500)
    } else {
      setEntries((prev) => [...prev, { type: "response", content: `No WHOIS data found for domain: ${domain}` }])
    }
  }

  // Function to handle dig command for CTF
  const handleDigCommand = (domain: string, recordType: string) => {
    if (domain === "secret.dedsec-ctf.com" && recordType.toUpperCase() === "TXT") {
      // Simulate DNS TXT record
      setTimeout(() => {
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content:
              `; <<>> DiG 9.16.1 <<>> secret.dedsec-ctf.com TXT\n` +
              `;; global options: +cmd\n` +
              `;; Got answer:\n` +
              `;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345\n` +
              `;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n\n` +
              `;; OPT PSEUDOSECTION:\n` +
              `; EDNS: version: 0, flags:; udp: 4096\n` +
              `;; QUESTION SECTION:\n` +
              `;secret.dedsec-ctf.com.	IN	TXT\n\n` +
              `;; ANSWER SECTION:\n` +
              `secret.dedsec-ctf.com.	300	IN	TXT	"DEDSEC{DN5_R3C0RD5_R3V34L}"\n\n` +
              `;; Query time: 42 ms\n` +
              `;; SERVER: 8.8.8.8#53(8.8.8.8)\n` +
              `;; WHEN: ${new Date().toUTCString()}\n` +
              `;; MSG SIZE  rcvd: 98`,
          },
        ])
      }, 500)
    } else {
      setEntries((prev) => [
        ...prev,
        {
          type: "response",
          content: `No ${recordType} records found for domain: ${domain}`,
        },
      ])
    }
  }

  // Function to handle run-binary command for CTF
  const handleRunBinaryCommand = (path: string) => {
    if (path === "/challenges/pwn/buffer") {
      // Simulate buffer overflow challenge
      setEntries((prev) => [
        ...prev,
        {
          type: "response",
          content:
            `Running binary: ${path}\n\n` +
            `Welcome to Buffer Overflow 101!\n` +
            `This program has a vulnerability in its input handling.\n` +
            `Enter your name: `,
        },
      ])

      // Wait for user input in the next command
      setEntries((prev) => [
        ...prev,
        {
          type: "ctf-info",
          content: `[HINT] This is an interactive challenge. Type a very long input in your next command to trigger the buffer overflow.`,
        },
      ])
    } else {
      setEntries((prev) => [...prev, { type: "error", content: `run-binary: cannot access '${path}': No such file` }])
    }
  }

  // Function to check for buffer overflow exploit
  const checkBufferOverflow = (input: string) => {
    if (input.length > 50) {
      setEntries((prev) => [
        ...prev,
        {
          type: "response",
          content:
            `Processing input...\n` +
            `[!] Buffer overflow detected!\n` +
            `[!] EIP register overwritten\n` +
            `[!] Executing shellcode...\n\n` +
            `$ whoami\n` +
            `root\n\n` +
            `$ cat /etc/flag.txt\n` +
            `DEDSEC{BUFF3R_0V3RFL0W_B4S1CS}`,
        },
      ])
    } else {
      setEntries((prev) => [
        ...prev,
        {
          type: "response",
          content: `Hello, ${input}!\n\n` + `Program completed normally. No vulnerabilities exploited.`,
        },
      ])
    }
  }

  // Check for hidden command (for misc1 challenge)
  const checkHiddenCommand = (command: string) => {
    if (command.toLowerCase() === "flag") {
      setEntries((prev) => [
        ...prev,
        {
          type: "ctf-success",
          content: `You found the hidden command!\n\n` + `DEDSEC{H1DD3N_C0MM4ND5}`,
        },
      ])
      return true
    }
    return false
  }

  const processCommand = (input: string) => {
    const [command, ...args] = input.toLowerCase().split(" ")

    // Check for hidden command (for misc1 challenge)
    if (checkHiddenCommand(command)) {
      return
    }

    // Check for buffer overflow exploit attempt
    if (input.length > 50 && entries[entries.length - 2]?.content?.includes("Buffer Overflow 101")) {
      checkBufferOverflow(input)
      return
    }

    switch (command) {
      case "help":
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content:
              "Available commands:\n\n" + helperCommands.map((cmd) => `${cmd.cmd.padEnd(15)} - ${cmd.desc}`).join("\n"),
          },
        ])
        break

      case "clear":
        setEntries([])
        break

      case "ls":
        const targetPath = args.length > 0 ? resolvePath(args[0]) : currentDirectory
        const contents = getFolderContents(targetPath)

        if (!contents) {
          setEntries((prev) => [
            ...prev,
            { type: "error", content: `ls: cannot access '${targetPath}': No such directory` },
          ])
        } else {
          const dirList = contents
            .filter((item) => item.type === "directory")
            .map((item) => `\x1b[36m${item.name}/\x1b[0m`)

          const fileList = contents.filter((item) => item.type === "file").map((item) => item.name)

          const output = [...dirList, ...fileList].join("  ")
          setEntries((prev) => [...prev, { type: "response", content: output || "(empty directory)" }])
        }
        break

      case "cd":
        if (args.length === 0) {
          // cd with no args goes to root
          setCurrentDirectory("/")
          break
        }

        const newPath = resolvePath(args[0])

        if (isValidDirectory(newPath)) {
          setCurrentDirectory(newPath.endsWith("/") ? newPath : `${newPath}/`)
        } else {
          setEntries((prev) => [...prev, { type: "error", content: `cd: ${args[0]}: No such directory` }])
        }
        break

      case "cat":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "cat: missing file operand" }])
          break
        }

        const filePath = args[0]
        const fileContent = getFileContent(filePath)

        if (fileContent !== null) {
          setEntries((prev) => [...prev, { type: "response", content: fileContent }])
        } else {
          setEntries((prev) => [...prev, { type: "error", content: `cat: ${filePath}: No such file` }])
        }
        break

      case "whoami":
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content: "user: visitor\nrole: guest\naccess-level: limited\nsession: encrypted",
          },
        ])
        break

      case "skills":
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content: `
SECURITY SKILLS PROFILE:
-----------------------
- Penetration Testing     [██████████] 100%
- Vulnerability Analysis  [████████░░]  80%
- Secure Code Review      [█████████░]  90% 
- Network Security        [████████░░]  80%
- Incident Response       [███████░░░]  70%
- Cloud Security          [█████████░]  90%
- Social Engineering      [████████░░]  80%
- Cryptography            [██████░░░░]  60%
- Reverse Engineering     [████████░░]  80%
`,
          },
        ])
        break

      case "projects":
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content: `
RECENT SECURITY PROJECTS:
-----------------------
1. Operation Blackout - Enterprise security audit
   > Found 17 critical vulnerabilities in client infrastructure
   > Prevented potential data breach affecting 1.2M users

2. Project Watchdog - Custom IDS/IPS implementation
   > Deployed across 8 financial institutions
   > Detected 42% more threats than previous solutions

3. Cipher Protocol - E2E encrypted messaging 
   > Zero-knowledge architecture
   > Successfully passed independent security audit

4. Ghost Network - Anonymous routing system
   > Enhanced protection against traffic analysis
   > Currently used by journalists in high-risk environments
`,
          },
        ])
        break

      case "contact":
        setEntries((prev) => [
          ...prev,
          {
            type: "response",
            content: `
SECURE CONTACT CHANNELS:
----------------------
Email: contact@cyberexpert.sec [PGP encrypted]
Signal: +1 (555) 123-4567
Matrix: @security_expert:matrix.org

PGP KEY FINGERPRINT:
4A44 8855 0638 AD35 3AA5  60A1 DD2E 1CA5 1112 9008
`,
          },
        ])
        break

      case "nmap":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "nmap: missing target operand" }])
          break
        }

        const scanResult = simulateScan(args[0])
        setEntries((prev) => [...prev, { type: "response", content: scanResult }])
        break

      case "hack":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "hack: missing target operand" }])
          break
        }

        const hackResult = simulateHack(args[0])
        setEntries((prev) => [...prev, { type: "response", content: hackResult }])
        break

      case "ctf":
        handleCTFCommand(args)
        break

      case "cookies":
        handleCookiesCommand()
        break

      case "view-source":
        handleViewSourceCommand()
        break

      case "curl":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "curl: missing URL operand" }])
          break
        }
        handleCurlCommand(args[0])
        break

      case "exif":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "exif: missing file operand" }])
          break
        }
        handleExifCommand(args[0])
        break

      case "whois":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "whois: missing domain operand" }])
          break
        }
        handleWhoisCommand(args[0])
        break

      case "dig":
        if (args.length < 2) {
          setEntries((prev) => [
            ...prev,
            { type: "error", content: "dig: missing domain or record type. Usage: dig <domain> <record_type>" },
          ])
          break
        }
        handleDigCommand(args[0], args[1])
        break

      case "run-binary":
        if (args.length === 0) {
          setEntries((prev) => [...prev, { type: "error", content: "run-binary: missing file operand" }])
          break
        }
        handleRunBinaryCommand(args[0])
        break

      case "exit":
        if (onClose) {
          onClose()
        }
        break

      default:
        setEntries((prev) => [...prev, { type: "error", content: `${command}: command not found` }])
    }
  }

  const formatTerminalOutput = (entry: TerminalEntry) => {
    // Format ANSI color codes
    const content = entry.content
      .replace(/\x1b\[36m(.*?)\x1b\[0m/g, '<span class="text-cyan-500">$1</span>')
      .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span class="text-green-500">$1</span>')
      .replace(/\x1b\[33m(.*?)\x1b\[0m/g, '<span class="text-yellow-500">$1</span>')

    if (entry.type === "ascii") {
      return <pre className="text-[#ff0066] font-mono">{content}</pre>
    }

    if (entry.type === "welcome") {
      return <div className="text-gray-400 mb-2">{content}</div>
    }

    if (entry.type === "command") {
      return <div className="text-green-500 font-mono">{content}</div>
    }

    if (entry.type === "error") {
      return <div className="text-red-500 font-mono">{content}</div>
    }

    if (entry.type === "ctf-success") {
      return (
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-md mb-2">
          <pre className="text-green-500 font-mono whitespace-pre-wrap">{content}</pre>
        </div>
      )
    }

    if (entry.type === "ctf-fail") {
      return (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-md mb-2">
          <pre className="text-red-500 font-mono whitespace-pre-wrap">{content}</pre>
        </div>
      )
    }

    if (entry.type === "ctf-info") {
      return (
        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-md mb-2">
          <pre className="text-blue-400 font-mono whitespace-pre-wrap">{content}</pre>
        </div>
      )
    }

    // Handle normal text and preserve newlines
    if (content.includes("\n")) {
      return <pre className="text-gray-300 font-mono whitespace-pre-wrap">{content}</pre>
    }

    return <div className="text-gray-300 font-mono" dangerouslySetInnerHTML={{ __html: content }} />
  }

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      ref={terminalRef}
      className={cn(
        "fixed z-50 bg-black/90 backdrop-blur-md border border-[#ff0066]/50 rounded-lg shadow-lg overflow-hidden",
        fullScreen ? "inset-0 w-full h-full rounded-none" : "w-[600px] h-[400px]",
        className,
      )}
      style={
        fullScreen
          ? {}
          : {
              top: position.y,
              left: position.x,
            }
      }
      onClick={handleTerminalClick}
    >
      {/* Terminal header */}
      <div
        className="terminal-drag-handle flex items-center justify-between px-4 py-2 bg-black border-b border-[#ff0066]/50 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-[#ff0066]" />
          <span className="text-sm font-mono text-white">DEDSEC_TERMINAL</span>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-transparent"
            onClick={() => onToggleFullScreen && onToggleFullScreen()}
          >
            {fullScreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-transparent"
            onClick={() => onClose && onClose()}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal output area */}
      <div ref={terminalOutputRef} className="p-4 h-[calc(100%-86px)] overflow-y-auto font-mono text-sm">
        {entries.map((entry, index) => (
          <div key={index} className="mb-2">
            {formatTerminalOutput(entry)}
          </div>
        ))}
      </div>

      {/* Terminal input area */}
      <div className="flex items-center px-4 py-2 bg-black/70 border-t border-[#ff0066]/30">
        <div className="flex-shrink-0 flex items-center text-[#ff0066] mr-2">
          <ChevronRight className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-white font-mono text-sm"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
