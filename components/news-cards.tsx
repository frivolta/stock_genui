"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  summary: string
}

interface NewsCardsProps {
  news: NewsItem[]
}

export function NewsCards({ news }: NewsCardsProps) {
  return (
    <div className="grid gap-4 w-full max-w-2xl">
      {news.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-base text-zinc-100 leading-tight group-hover:text-blue-400 transition-colors">
                  {item.title}
                </CardTitle>
                <ExternalLink className="w-4 h-4 text-zinc-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex gap-2 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">{item.source}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 line-clamp-2">
                {item.summary}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
