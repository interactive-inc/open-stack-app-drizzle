import { factory } from "@/api/interface/factory"

export const GET = factory.createHandlers(async (c) => {
  return c.json({ MY_VAR: c.env.MY_VAR })
})
