"use client"

import { useChat } from "ai/react"
import { Message, ToolInvocation } from "ai"
import { StockChart } from "@/components/stock-chart"
import { NewsCards } from "@/components/news-cards"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef } from "react"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      <header className="p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
          Financial Assistant
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 mt-20">
              <p className="text-lg font-medium">Ask about stocks or market news.</p>
              <p className="text-sm mt-2">Try &quot;Show me AAPL stock&quot; or &quot;Latest tech news&quot;</p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((m: Message) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {/* Text Content */}
                {m.content && (
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      m.role === "user"
                        ? "bg-zinc-800 text-zinc-100 rounded-br-sm"
                        : "bg-transparent text-zinc-300 rounded-bl-sm border border-zinc-800/50"
                    }`}
                  >
                    {m.content}
                  </div>
                )}

                {/* Tool Invocations */}
                {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                  const toolCallId = toolInvocation.toolCallId
                  
                  // Render Loading State
                  if (!('result' in toolInvocation)) {
                    return (
                      <div key={toolCallId} className="mt-2 w-full max-w-md">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-zinc-800 rounded"></div>
                              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  // Render Tool Result
                  if (toolInvocation.toolName === "showStockPrice") {
                    return (
                      <div key={toolCallId} className="mt-2 w-full">
                        <StockChart {...toolInvocation.result} />
                      </div>
                    )
                  }

                  if (toolInvocation.toolName === "showNews") {
                    return (
                      <div key={toolCallId} className="mt-2 w-full">
                        <NewsCards news={toolInvocation.result} />
                      </div>
                    )
                  }

                  return null
                })}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && messages[messages.length - 1]?.role === "user" && (
             <div className="flex justify-start">
               <div className="bg-zinc-800/50 px-4 py-2 rounded-2xl rounded-bl-sm">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                   <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                   <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t border-zinc-800 bg-zinc-950">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about stocks..."
            className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
          />
          <Button type="submit" size="icon" className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </footer>
    </div>
  )
}
