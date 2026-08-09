import { getSignedCookie } from "hono/cookie"
import { factory } from "@/api/interface/factory"
import { parseSessionToken } from "@/lib/session/session-token"

export const GET = factory.createHandlers(async (c) => {
  const cookie = await getSignedCookie(c, c.env.JWT_COOKIE_SECRET, c.env.JWT_COOKIE_KEY)

  if (typeof cookie !== "string") {
    return c.json(null)
  }

  const session = await parseSessionToken(cookie, c.env.JWT_SECRET)

  return c.json(session)
})
