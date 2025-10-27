import { deleteCookie } from "hono/cookie"
import { factory } from "@/api/interface/factory"

export const [POST] = factory.createHandlers(async (c) => {
  deleteCookie(c, c.env.JWT_COOKIE_KEY)

  return c.json({})
})
