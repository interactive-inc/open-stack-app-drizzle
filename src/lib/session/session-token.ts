import { sign, verify } from "hono/jwt"
import { vSessionPayload, type SessionPayload } from "@/lib/session/session-payload"
import { SESSION_MAX_AGE_SECONDS } from "@/lib/session/session-cookie"

export async function createSessionToken(
  payload: SessionPayload,
  secret: string,
  issuedAt = Math.floor(Date.now() / 1000),
) {
  return sign(
    {
      ...payload,
      exp: issuedAt + SESSION_MAX_AGE_SECONDS,
      iat: issuedAt,
    },
    secret,
  )
}

export async function parseSessionToken(token: string, secret: string) {
  try {
    const payload = await verify(token, secret)
    const session = vSessionPayload.safeParse(payload)

    return session.success ? session.data : null
  } catch {
    return null
  }
}
