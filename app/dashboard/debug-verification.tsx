"use client"

import { useEffect, useState } from "react"

interface LogEntry {
  timestamp: string
  userId: string
  action: string
  data: string
}

export function DebugVerification() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    // Intercept console.log to capture debug logs
    const originalLog = console.log

    console.log = (...args: any[]) => {
      if (args[0]?.includes?.("[v0]")) {
        const userId = localStorage.getItem("user_id") || "unknown"
        const timestamp = new Date().toLocaleTimeString()

        setLogs((prev) =>
          [
            {
              timestamp,
              userId,
              action: args[0],
              data: JSON.stringify(args.slice(1)),
            },
            ...prev,
          ].slice(0, 50),
        ) // Keep last 50 logs
      }
      originalLog(...args)
    }

    return () => {
      console.log = originalLog
    }
  }, [])

  return (
    <div className="mt-8 p-4 bg-slate-900 text-white rounded-lg font-mono text-xs overflow-auto max-h-96">
      <h3 className="font-bold mb-3 text-yellow-400">Multi-User Debug Verification</h3>
      <div className="space-y-1">
        {logs.length === 0 ? (
          <div className="text-gray-400">Watching for real-time updates...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <span className="text-blue-400 w-20">{log.timestamp}</span>
              <span className={`w-16 ${log.userId === "1" ? "text-green-400" : "text-orange-400"}`}>
                User{log.userId === "1" ? "1" : "2"}
              </span>
              <span className="text-purple-300 flex-1">{log.action}</span>
              <span className="text-gray-500 truncate">{log.data}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
