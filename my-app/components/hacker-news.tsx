"use client"

import { useState } from "react"
import { ExternalLink, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HackerNews() {
  const [news, setNews] = useState([
    {
      title: "Critical Zero-Day Vulnerability Found in Popular VPN Service",
      date: "2 hours ago",
      severity: "critical",
      source: "CVE Database",
    },
    {
      title: "New Ransomware Strain Targeting Healthcare Sector",
      date: "5 hours ago",
      severity: "high",
      source: "Security Weekly",
    },
    {
      title: "Major Tech Company Patches Authentication Bypass Flaw",
      date: "1 day ago",
      severity: "medium",
      source: "Threat Post",
    },
    {
      title: "Government Issues Advisory on State-Sponsored Attacks",
      date: "2 days ago",
      severity: "high",
      source: "CISA",
    },
  ])

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <div key={index} className="border border-[#ff0066]/30 rounded p-3 hover:bg-[#ff0066]/5 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {item.severity === "critical" ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : item.severity === "high" ? (
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{item.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.source}</span>
                </div>
                <Button variant="link" size="sm" className="text-[#ff0066] p-0 h-auto flex items-center gap-1">
                  <span>Read</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
