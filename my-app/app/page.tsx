"use client"

import { useState, useEffect } from "react"
import { Terminal, Skull, Shield, Code, Wifi, Lock, Eye, Database, Server } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import GlitchText from "@/components/glitch-text"
import GlitchImage from "@/components/glitch-image"
import TerminalEffect from "@/components/terminal-effect"
import HackerNews from "@/components/hacker-news"
import TerminalInterface from "@/components/terminal-interface"
import { motion } from "framer-motion"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [terminalText, setTerminalText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isFullScreenTerminal, setIsFullScreenTerminal] = useState(false)

  useEffect(() => {
    const text =
      "> INITIALIZING SYSTEM...\n> BYPASSING SECURITY PROTOCOLS...\n> ACCESS GRANTED\n> WELCOME TO THE NETWORK"
    let index = 0

    const typeWriter = () => {
      if (index < text.length) {
        setTerminalText(text.substring(0, index + 1))
        index++
        setTimeout(typeWriter, Math.random() * 50 + 20)
      }
    }

    typeWriter()

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(cursorInterval)
    }
  }, [])

  const toggleTerminal = () => {
    setIsTerminalOpen((prev) => !prev)
  }

  const toggleFullScreenTerminal = () => {
    setIsFullScreenTerminal((prev) => !prev)
  }

  if (showIntro) {
    return (
      <div className="bg-black text-green-500 h-screen flex items-center justify-center font-mono">
        <div className="max-w-2xl w-full p-4">
          <div className="border border-green-500 p-4 rounded-md bg-black/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5" />
                <span>DEDSEC_TERMINAL</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="h-64 overflow-hidden">
              <pre className="whitespace-pre-wrap">
                {terminalText}
                {cursorVisible && <span className="animate-pulse">_</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(#ff0066_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Glitch overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="glitch-lines"></div>
      </div>

      {/* Terminal Interface */}
      <TerminalInterface
        isOpen={isTerminalOpen}
        onClose={toggleTerminal}
        fullScreen={isFullScreenTerminal}
        onToggleFullScreen={toggleFullScreenTerminal}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-[#ff0066]/30 backdrop-blur-sm bg-black/70">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skull className="w-6 h-6 text-[#ff0066]" />
            <GlitchText text="CYBER_EXPERT" className="text-xl font-bold tracking-wider" />
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#about" className="text-sm uppercase hover:text-[#ff0066] transition-colors">
              About
            </Link>
            <Link href="#skills" className="text-sm uppercase hover:text-[#ff0066] transition-colors">
              Skills
            </Link>
            <Link href="#projects" className="text-sm uppercase hover:text-[#ff0066] transition-colors">
              Projects
            </Link>
            <Link href="#contact" className="text-sm uppercase hover:text-[#ff0066] transition-colors">
              Contact
            </Link>
            <Button
              variant="outline"
              className="border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066]/10"
              onClick={toggleTerminal}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Terminal
            </Button>
          </nav>

          <Button variant="ghost" className="md:hidden text-[#ff0066]" onClick={toggleTerminal}>
            <Terminal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-white">SECURITY</span>
                <span className="block text-[#ff0066]">SPECIALIST</span>
              </h1>
              <p className="text-gray-400 mb-6 max-w-md">
                Ethical hacker, penetration tester, and cybersecurity expert. Breaking systems to make them stronger.
              </p>
              <div className="flex gap-4">
                <Button className="bg-[#ff0066] hover:bg-[#ff0066]/80 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Hire Me
                </Button>
                <Button
                  variant="outline"
                  className="border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066]/10"
                  onClick={toggleTerminal}
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Open Terminal
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <GlitchImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dedsec2.jpg-QN2bljUYDWP1jwiSRd9eOQD6hDdgnK.jpeg"
              alt="DedSec Logo"
              width={500}
              height={500}
              className="rounded-lg border border-[#ff0066]/30"
            />
            <div
              className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-sm p-3 border border-[#ff0066]/30 rounded text-xs font-mono cursor-pointer"
              onClick={toggleTerminal}
            >
              <div className="flex items-center gap-2 text-[#ff0066]">
                <Eye className="w-4 h-4" />
                <span>SYSTEM COMPROMISED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 container mx-auto px-4 border-t border-[#ff0066]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
            <h2 className="text-2xl font-bold text-[#ff0066]">ABOUT</h2>
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 mb-4">
                I'm a cybersecurity specialist with over 8 years of experience in penetration testing, vulnerability
                assessment, and security architecture. My mission is to help organizations strengthen their security
                posture against evolving threats.
              </p>
              <p className="text-gray-400 mb-4">
                With a background in both offensive and defensive security, I bring a comprehensive approach to
                identifying and mitigating security risks before they can be exploited.
              </p>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="sm" className="border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066]/10">
                  <Code className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066]/10"
                  onClick={toggleTerminal}
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Terminal
                </Button>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-[#ff0066]/30 rounded-lg p-4">
              <TerminalEffect />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 container mx-auto px-4 border-t border-[#ff0066]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
            <h2 className="text-2xl font-bold text-[#ff0066]">SKILLS</h2>
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <Shield className="w-5 h-5 text-[#ff0066]" />,
                title: "Penetration Testing",
                desc: "Web, mobile, network, and infrastructure",
              },
              {
                icon: <Lock className="w-5 h-5 text-[#ff0066]" />,
                title: "Security Architecture",
                desc: "Designing secure systems and networks",
              },
              {
                icon: <Code className="w-5 h-5 text-[#ff0066]" />,
                title: "Secure Coding",
                desc: "Identifying and fixing vulnerabilities",
              },
              {
                icon: <Wifi className="w-5 h-5 text-[#ff0066]" />,
                title: "Wireless Security",
                desc: "Securing wireless networks and devices",
              },
              {
                icon: <Database className="w-5 h-5 text-[#ff0066]" />,
                title: "Database Security",
                desc: "Protecting sensitive data",
              },
              {
                icon: <Server className="w-5 h-5 text-[#ff0066]" />,
                title: "Cloud Security",
                desc: "Securing cloud infrastructure",
              },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/50 backdrop-blur-sm border border-[#ff0066]/30 rounded-lg p-4 hover:bg-[#ff0066]/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{skill.icon}</div>
                  <div>
                    <h3 className="font-bold mb-1">{skill.title}</h3>
                    <p className="text-sm text-gray-400">{skill.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 container mx-auto px-4 border-t border-[#ff0066]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
            <h2 className="text-2xl font-bold text-[#ff0066]">PROJECTS</h2>
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Operation Blackout",
                desc: "Comprehensive security audit for a Fortune 500 company",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dedsec3-0p4VNKh8iGnmzdJtOxwNkLrCIM3dvv.png",
              },
              {
                title: "Project Watchdog",
                desc: "Custom IDS/IPS system for critical infrastructure",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dedsec1-VMN1nQYIeRmMksX5Rh6Zg8GWIwnLrC.jpeg",
              },
              {
                title: "Cipher Protocol",
                desc: "End-to-end encrypted messaging platform",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dedsec0-56kn8SVkqTvB2qIXXvRY51kykF3d0r.jpeg",
              },
              {
                title: "Ghost Network",
                desc: "Anonymous routing system for secure communications",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dedsec2.jpg-QN2bljUYDWP1jwiSRd9eOQD6hDdgnK.jpeg",
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg border border-[#ff0066]/30"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-300">{project.desc}</p>
                  <Button variant="link" className="text-[#ff0066] p-0 mt-2 text-sm">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTF Challenges Section */}
      <section className="relative z-10 py-20 container mx-auto px-4 border-t border-[#ff0066]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
            <h2 className="text-2xl font-bold text-[#ff0066]">CTF CHALLENGES</h2>
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-[#ff0066]/30 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Test Your Hacking Skills</h3>
              <p className="text-gray-400">
                Put your cybersecurity knowledge to the test with our Capture The Flag challenges. Solve puzzles, crack
                codes, and find hidden flags to prove your skills.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-black/70 border border-[#ff0066]/20 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Lock className="w-4 h-4 text-[#ff0066] mr-2" />
                  Cryptography
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  Decode encrypted messages, crack ciphers, and uncover hidden data.
                </p>
                <div className="text-xs text-gray-500">3 challenges available</div>
              </div>

              <div className="bg-black/70 border border-[#ff0066]/20 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Code className="w-4 h-4 text-[#ff0066] mr-2" />
                  Web Exploitation
                </h4>
                <p className="text-sm text-gray-400 mb-3">Find and exploit vulnerabilities in web applications.</p>
                <div className="text-xs text-gray-500">3 challenges available</div>
              </div>

              <div className="bg-black/70 border border-[#ff0066]/20 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Database className="w-4 h-4 text-[#ff0066] mr-2" />
                  Forensics
                </h4>
                <p className="text-sm text-gray-400 mb-3">Analyze files and data to uncover hidden information.</p>
                <div className="text-xs text-gray-500">2 challenges available</div>
              </div>

              <div className="bg-black/70 border border-[#ff0066]/20 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Wifi className="w-4 h-4 text-[#ff0066] mr-2" />
                  Reconnaissance
                </h4>
                <p className="text-sm text-gray-400 mb-3">Gather intelligence and discover hidden information.</p>
                <div className="text-xs text-gray-500">2 challenges available</div>
              </div>
            </div>

            <Button
              className="w-full bg-[#ff0066] hover:bg-[#ff0066]/80 text-white"
              onClick={() => {
                toggleTerminal()
                // Add a small delay to ensure terminal is open before sending command
                setTimeout(() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                  })

                  // Set input value to "ctf" and dispatch Enter key event
                  const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
                  if (inputElement) {
                    inputElement.value = "ctf"
                    inputElement.dispatchEvent(event)
                  }
                }, 500)
              }}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Start CTF Challenges
            </Button>
          </div>
        </div>
      </section>

      {/* News Feed Section */}
      <section className="relative z-10 py-20 container mx-auto px-4 border-t border-[#ff0066]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
            <h2 className="text-2xl font-bold text-[#ff0066]">SECURITY FEED</h2>
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-[#ff0066]/30 rounded-lg p-4">
            <HackerNews />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 container mx-auto px-4 border-t border-[#ff0066]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
            <h2 className="text-2xl font-bold text-[#ff0066]">CONTACT</h2>
            <div className="h-px flex-1 bg-[#ff0066]/30"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 mb-6">
                Need a security consultation or have a project in mind? Get in touch through the secure channels below.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff0066]/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#ff0066]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Secure Email</div>
                    <div className="font-mono">contact@cyberexpert.sec</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff0066]/10 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-[#ff0066]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">PGP Key</div>
                    <div className="font-mono text-sm">0xD8F3A1B7C6E9...</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-[#ff0066]/30 rounded-lg p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-[#ff0066]/30 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-[#ff0066]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full bg-black/50 border border-[#ff0066]/30 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-[#ff0066]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-black/50 border border-[#ff0066]/30 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-[#ff0066]"
                  ></textarea>
                </div>

                <Button className="w-full bg-[#ff0066] hover:bg-[#ff0066]/80 text-white">
                  <Lock className="w-4 h-4 mr-2" />
                  Send Secure Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-[#ff0066]/30 bg-black/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Skull className="w-5 h-5 text-[#ff0066]" />
              <GlitchText text="CYBER_EXPERT" className="text-lg font-bold" />
            </div>

            <div className="text-sm text-gray-400">&copy; {new Date().getFullYear()} | Secured by DedSec Protocols</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
