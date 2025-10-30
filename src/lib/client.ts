import { hc } from "hono/client"
import type { app } from "@/api"

const endpoint =
  typeof window !== "undefined" ? location.origin : "http://localhost"

export const client = hc<typeof app>(endpoint, {
  init: { credentials: "include", mode: "cors" },
})
