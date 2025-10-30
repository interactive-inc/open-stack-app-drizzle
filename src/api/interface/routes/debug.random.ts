import { factory } from "@/api/interface/factory"

export const GET = factory.createHandlers(async (c) => {
  console.log("GET /debug/random called")

  await new Promise((resolve) => setTimeout(resolve, 2000))

  return c.json({ value: Math.random() })
})

export const POST = factory.createHandlers(async (c) => {
  console.log("POST /debug/random called")

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return c.json({ value: Math.random() })
})
