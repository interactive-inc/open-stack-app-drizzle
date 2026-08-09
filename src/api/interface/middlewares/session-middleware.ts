import { getSignedCookie } from "hono/cookie"
import { factory } from "@/api/interface/factory"
import { parseSessionToken } from "@/lib/session/session-token"

/**
 * c.var.sessionにログイン情報を設定する
 */
export const sessionMiddleware = factory.createMiddleware(async (c, next) => {
  c.set("session", null)

  const cookie = await getSignedCookie(c, c.env.JWT_COOKIE_SECRET, c.env.JWT_COOKIE_KEY)

  if (typeof cookie !== "string") {
    return next()
  }

  const session = await parseSessionToken(cookie, c.env.JWT_SECRET)

  if (session === null) {
    return next()
  }

  c.set("session", session)

  return next()
})
