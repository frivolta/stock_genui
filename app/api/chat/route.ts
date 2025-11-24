import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

// Mock Data Generators
function generateStockData(symbol: string) {
  const basePrice = Math.random() * 1000
  const data = []
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (30 - i))
    data.push({
      date: date.toISOString().split("T")[0],
      value: basePrice + (Math.random() - 0.5) * 50,
    })
  }
  const currentPrice = data[data.length - 1].value
  const startPrice = data[0].value
  const delta = ((currentPrice - startPrice) / startPrice) * 100

  return {
    symbol: symbol.toUpperCase(),
    price: currentPrice,
    delta,
    data,
  }
}

function generateNews(topic: string) {
  return [
    {
      id: "1",
      title: `${topic} Announces Record Q4 Earnings`,
      source: "Financial Times",
      time: "2h ago",
      summary: "The company exceeded analyst expectations with strong revenue growth in cloud computing and AI sectors.",
    },
    {
      id: "2",
      title: `Market Analysis: ${topic}'s Strategic Shift`,
      source: "Bloomberg",
      time: "4h ago",
      summary: "Experts weigh in on the recent strategic pivot and its potential impact on long-term market position.",
    },
    {
      id: "3",
      title: `Tech Sector Rally Lifts ${topic}`,
      source: "Reuters",
      time: "6h ago",
      summary: "Broader market trends contribute to a significant uptick in stock value for major tech players.",
    },
  ]
}

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful financial assistant. If the user asks for market data, call the appropriate tool. 
    Do not write JSON in text; purely use the tool calls. 
    If the user asks for news, call the showNews tool.
    If the user asks for stock price, call the showStockPrice tool.
    Keep your text responses concise and professional.`,
    tools: {
      showStockPrice: tool({
        description: "Get the current stock price and history for a given symbol",
        parameters: z.object({
          symbol: z.string().describe("The stock symbol, e.g. AAPL"),
        }),
        execute: async ({ symbol }) => {
          return generateStockData(symbol)
        },
      }),
      showNews: tool({
        description: "Get recent news for a given topic or company",
        parameters: z.object({
          topic: z.string().describe("The topic or company name"),
        }),
        execute: async ({ topic }) => {
          return generateNews(topic)
        },
      }),
    },
  })

  return result.toAIStreamResponse()
}
