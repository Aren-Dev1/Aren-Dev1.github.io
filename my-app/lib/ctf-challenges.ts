export interface CTFChallenge {
  id: string
  title: string
  category: "crypto" | "web" | "forensics" | "recon" | "pwn" | "misc"
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string
  hints: string[]
  flag: string
  solved?: boolean
  points: number
  files?: CTFFile[]
  setup?: () => Promise<void> // Function to set up the challenge environment
}

export interface CTFFile {
  name: string
  content: string
}

// Challenge data
export const ctfChallenges: CTFChallenge[] = [
  // Cryptography Challenges
  {
    id: "crypto1",
    title: "Basic Encryption",
    category: "crypto",
    difficulty: "beginner",
    description:
      "Someone encrypted a message using a simple Caesar cipher. Can you decrypt it?\n\n" +
      "Encrypted message: KLKZLJ{IBTPJ_JHLZBY_JPWOLY}",
    hints: [
      "Caesar ciphers shift each letter by a fixed number of positions.",
      "The flag format is DEDSEC{FLAG_TEXT}. Try to find what shift gives you 'DEDSEC'.",
    ],
    flag: "DEDSEC{BASIC_CAESAR_CIPHER}",
    points: 100,
  },
  {
    id: "crypto2",
    title: "Base Jumper",
    category: "crypto",
    difficulty: "beginner",
    description:
      "We intercepted this encoded string. It looks like some kind of base encoding.\n\n" +
      "REVEU0VDe0I0UzNfNjRfM05DMGQxTkd9",
    hints: ["This is a very common encoding used for binary data in web applications.", "Try decoding it from Base64."],
    flag: "DEDSEC{B4S3_64_3NC0d1NG}",
    points: 150,
  },
  {
    id: "crypto3",
    title: "Hash Cracker",
    category: "crypto",
    difficulty: "intermediate",
    description:
      "We found this MD5 hash in a database leak. Can you crack it?\n\n" + "5f4dcc3b5aa765d61d8327deb882cf99",
    hints: ["This is a very common password.", "Try looking up the hash in a rainbow table or common hash database."],
    flag: "DEDSEC{password}",
    points: 200,
  },

  // Web Challenges
  {
    id: "web1",
    title: "Cookie Monster",
    category: "web",
    difficulty: "beginner",
    description:
      "There's a flag hidden in the cookie jar. Use the 'cookies' command to inspect the cookies for this site.",
    hints: [
      "The 'cookies' command will show you all cookies for the current domain.",
      "Look for a cookie with an unusual name or encoded value.",
    ],
    flag: "DEDSEC{C00K13_M0N5T3R}",
    points: 100,
    setup: async () => {
      // This would normally set a cookie, but we'll simulate it
      document.cookie = "flag=REVEU0VDe0MwMEsxM19NME41VDNSSQ==;path=/;max-age=3600"
    },
  },
  {
    id: "web2",
    title: "Source Code Secrets",
    category: "web",
    difficulty: "beginner",
    description:
      "There's a hidden comment in the HTML source code of this page. Use the 'view-source' command to find it.",
    hints: [
      "Developers sometimes leave comments in HTML that contain sensitive information.",
      "Look for HTML comments that start with <!-- and end with -->",
    ],
    flag: "DEDSEC{H1DD3N_1N_PL41N_S1GHT}",
    points: 150,
    setup: async () => {
      // This would normally add a comment to the HTML, but we'll simulate it
      const comment = document.createComment(" FLAG: DEDSEC{H1DD3N_1N_PL41N_S1GHT} ")
      document.body.appendChild(comment)
    },
  },
  {
    id: "web3",
    title: "API Snooping",
    category: "web",
    difficulty: "intermediate",
    description: "There's a hidden API endpoint at /api/secret. Use the 'curl' command to make a GET request to it.",
    hints: ["The syntax is: curl /api/secret", "You might need to add headers to your request."],
    flag: "DEDSEC{4P1_S3CR3TS_3XP0S3D}",
    points: 200,
  },

  // Forensics Challenges
  {
    id: "forensics1",
    title: "Hidden Message",
    category: "forensics",
    difficulty: "beginner",
    description:
      "There's a hidden message in this text file. Can you find it?\n\n" +
      "Use the 'cat' command to view the file at /challenges/forensics/hidden.txt",
    hints: [
      "Sometimes important information is hidden in plain sight.",
      "Try looking at the first letter of each line.",
    ],
    flag: "DEDSEC{STEGANOGRAPHY}",
    points: 100,
    files: [
      {
        name: "hidden.txt",
        content:
          "Delving into the world of cybersecurity\n" +
          "Exploring the digital landscape\n" +
          "Discovering vulnerabilities and exploits\n" +
          "Securing systems against threats\n" +
          "Ethical hacking is an art form\n" +
          "Constantly learning new techniques\n" +
          "Staying ahead of malicious actors\n" +
          "Testing defenses to ensure security\n" +
          "Encryption is a powerful tool\n" +
          "Guarding sensitive information\n" +
          "Always maintaining proper security hygiene\n" +
          "Network security is paramount\n" +
          "Observing unusual patterns\n" +
          "Gathering intelligence on threats\n" +
          "Responding to incidents effectively\n" +
          "Analyzing logs for suspicious activity\n" +
          "Protecting data integrity\n" +
          "Hardening systems against attacks\n" +
          "You must always remain vigilant",
      },
    ],
  },
  {
    id: "forensics2",
    title: "Metadata Mystery",
    category: "forensics",
    difficulty: "intermediate",
    description:
      "There's a flag hidden in the metadata of an image file. Use the 'exif' command to examine it.\n\n" +
      "exif /challenges/forensics/secret.jpg",
    hints: [
      "Metadata can contain a lot of hidden information about a file.",
      "Look for unusual fields or comments in the EXIF data.",
    ],
    flag: "DEDSEC{M3T4D4T4_L34K}",
    points: 200,
  },

  // Reconnaissance Challenges
  {
    id: "recon1",
    title: "WHOIS Hunting",
    category: "recon",
    difficulty: "beginner",
    description: "Find information about the domain 'dedsec-ctf.com' using the 'whois' command.",
    hints: [
      "The 'whois' command reveals registration information about domains.",
      "Look for unusual or hidden information in the registration details.",
    ],
    flag: "DEDSEC{WH01S_1NF0_L34K}",
    points: 100,
  },
  {
    id: "recon2",
    title: "DNS Digger",
    category: "recon",
    difficulty: "intermediate",
    description:
      "There's a special TXT record hidden in the DNS for 'secret.dedsec-ctf.com'. Use the 'dig' command to find it.",
    hints: ["The syntax is: dig secret.dedsec-ctf.com TXT", "DNS TXT records can contain arbitrary text data."],
    flag: "DEDSEC{DN5_R3C0RD5_R3V34L}",
    points: 150,
  },

  // Pwn/Binary Challenges
  {
    id: "pwn1",
    title: "Buffer Overflow 101",
    category: "pwn",
    difficulty: "intermediate",
    description:
      "This program has a buffer overflow vulnerability. Exploit it to get the flag.\n\n" +
      "Use 'run-binary /challenges/pwn/buffer' to execute the program.",
    hints: [
      "The program doesn't properly check the length of user input.",
      "Try entering a very long string to overflow the buffer.",
    ],
    flag: "DEDSEC{BUFF3R_0V3RFL0W_B4S1CS}",
    points: 250,
  },

  // Miscellaneous Challenges
  {
    id: "misc1",
    title: "Terminal Secrets",
    category: "misc",
    difficulty: "beginner",
    description: "There's a hidden command in this terminal. Find it by exploring the available commands.",
    hints: [
      "Try running commands that might reveal system information.",
      "Some commands might not be listed in the help menu.",
    ],
    flag: "DEDSEC{H1DD3N_C0MM4ND5}",
    points: 100,
  },
  {
    id: "misc2",
    title: "Logic Puzzle",
    category: "misc",
    difficulty: "intermediate",
    description:
      "Solve this logic puzzle to get the flag:\n\n" +
      "I'm thinking of a 4-digit number where:\n" +
      "- The first digit is one more than the third digit\n" +
      "- The second digit is twice the fourth digit\n" +
      "- The sum of all digits is 14\n" +
      "- The product of the first and last digits is 8\n\n" +
      "What number am I thinking of?",
    hints: [
      "Start by figuring out what the possible values for the first and last digits could be.",
      "If the product of the first and last digits is 8, what are the possibilities?",
    ],
    flag: "DEDSEC{4284}",
    points: 200,
  },
]

// Helper function to get a challenge by ID
export function getChallengeById(id: string): CTFChallenge | undefined {
  return ctfChallenges.find((challenge) => challenge.id === id)
}

// Helper function to get challenges by category
export function getChallengesByCategory(category: CTFChallenge["category"]): CTFChallenge[] {
  return ctfChallenges.filter((challenge) => challenge.category === category)
}

// Helper function to get challenges by difficulty
export function getChallengesByDifficulty(difficulty: CTFChallenge["difficulty"]): CTFChallenge[] {
  return ctfChallenges.filter((challenge) => challenge.difficulty === difficulty)
}

// Setup the CTF file system
export function setupCTFFileSystem() {
  // This would create the necessary files and directories for the challenges
  // For now, we'll just return a placeholder
  return {
    name: "challenges",
    type: "directory" as const,
    children: [
      {
        name: "README.txt",
        type: "file" as const,
        content:
          "Welcome to the DedSec CTF Challenges!\n\nUse the 'ctf' command to list available challenges and start playing.\n\nCommands:\n- ctf list: List all challenges\n- ctf info <id>: Show details about a specific challenge\n- ctf solve <id> <flag>: Submit a flag for a challenge\n- ctf hint <id>: Get a hint for a challenge\n- ctf status: Show your current progress\n\nGood luck, hacker!",
      },
      {
        name: "forensics",
        type: "directory" as const,
        children: ctfChallenges
          .filter((challenge) => challenge.category === "forensics" && challenge.files)
          .flatMap((challenge) => challenge.files || [])
          .map((file) => ({
            name: file.name,
            type: "file" as const,
            content: file.content,
          })),
      },
    ],
  }
}
