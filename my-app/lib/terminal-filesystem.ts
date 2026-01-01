export interface FileSystemNode {
  name: string
  type: "file" | "directory"
  content?: string
  children?: FileSystemNode[]
}

// Import the CTF challenges setup
import { setupCTFFileSystem } from "./ctf-challenges"

// Create a virtual file system structure
export const fileSystem: FileSystemNode = {
  name: "",
  type: "directory",
  children: [
    {
      name: "home",
      type: "directory",
      children: [
        {
          name: "visitor",
          type: "directory",
          children: [
            {
              name: "welcome.txt",
              type: "file",
              content: "Welcome to the DedSec terminal system.\nType 'help' to see available commands.",
            },
            {
              name: "about.txt",
              type: "file",
              content:
                "I am a cybersecurity specialist with over 8 years of experience in penetration testing, vulnerability assessment, and security architecture. My mission is to help organizations strengthen their security posture against evolving threats.",
            },
          ],
        },
      ],
    },
    {
      name: "projects",
      type: "directory",
      children: [
        {
          name: "operation-blackout",
          type: "directory",
          children: [
            {
              name: "readme.txt",
              type: "file",
              content:
                "Operation Blackout - Enterprise Security Audit\n\nComprehensive security audit for a Fortune 500 company. Found 17 critical vulnerabilities in client infrastructure that could have led to a data breach affecting 1.2M users.",
            },
            {
              name: "vulns.log",
              type: "file",
              content:
                "CVE-2021-44228: Log4Shell\nCVE-2022-22965: Spring4Shell\nCVE-2022-26134: Atlassian Confluence\nCVE-2022-41040: Microsoft Exchange\n\nPlus 13 additional custom vulnerabilities found in proprietary software.",
            },
          ],
        },
        {
          name: "watchdog",
          type: "directory",
          children: [
            {
              name: "readme.txt",
              type: "file",
              content:
                "Project Watchdog - Custom IDS/IPS Implementation\n\nDeployed across 8 financial institutions. Detected 42% more threats than previous solutions through AI-enhanced analysis.",
            },
            {
              name: "stats.txt",
              type: "file",
              content:
                "Threat detection rates:\n- Traditional IDS: 68%\n- Watchdog System: 97%\n\nFalse positive rates:\n- Traditional IDS: 23%\n- Watchdog System: 4%",
            },
          ],
        },
      ],
    },
    {
      name: "tools",
      type: "directory",
      children: [
        {
          name: "readme.txt",
          type: "file",
          content:
            "Security Tools Directory\n\nThis directory contains information about various security tools used in penetration testing and security audits.",
        },
        {
          name: "nmap.txt",
          type: "file",
          content:
            "Nmap - Network Mapper\n\nA free and open-source utility for network discovery and security auditing. Used for port scanning, OS detection, service version detection, and more.",
        },
        {
          name: "metasploit.txt",
          type: "file",
          content:
            "Metasploit Framework\n\nA penetration testing framework that helps security professionals identify vulnerabilities and conduct security assessments.",
        },
      ],
    },
    {
      name: "logs",
      type: "directory",
      children: [
        {
          name: "access.log",
          type: "file",
          content:
            "10:15:27 - User login from 192.168.1.105\n13:22:45 - Failed login attempt from 45.227.253.55\n15:30:12 - System update initiated\n15:45:33 - System update completed\n18:12:02 - Database backup started\n18:15:47 - Database backup completed",
        },
        {
          name: "system.log",
          type: "file",
          content:
            "CRITICAL: Unauthorized access attempt detected\nWARNING: Multiple failed login attempts\nINFO: System services restarted\nINFO: Firewall rules updated\nWARNING: High CPU usage detected",
        },
      ],
    },
    // Add the CTF challenges directory
    setupCTFFileSystem(),
    {
      name: "readme.txt",
      type: "file",
      content:
        "DedSec Terminal System v1.3.37\n\nThis terminal provides limited access to the system. Use 'help' to see available commands. For security reasons, certain directories and files may be restricted.",
    },
    {
      name: "security.txt",
      type: "file",
      content:
        "SECURITY ADVISORY\n\nAll activities on this system are logged and monitored. Unauthorized access is prohibited and may result in legal action.\n\nVulnerability disclosure policy: security@cyberexpert.sec",
    },
  ],
}
