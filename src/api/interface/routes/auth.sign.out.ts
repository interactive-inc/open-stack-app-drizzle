import { deleteCookie } from "hono/cookie"
import { factory } from "@/api/interface/factory"
import { createSessionCookieOptions } from "@/lib/session/session-cookie"

export const POST = factory.createHandlers(async (c) => {
  deleteCookie(c, c.env.JWT_COOKIE_KEY, createSessionCookieOptions(c.req.url))

  return c.json({})
})
