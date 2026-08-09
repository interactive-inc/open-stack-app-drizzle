import { sign } from "hono/jwt"
import { describe, expect, test } from "vite-plus/test"
import { createSessionToken, parseSessionToken } from "@/lib/session/session-token"

const secret = "test-secret"
const payload = {
  userId: "user-id",
  name: "Test User",
  email: "test@example.com",
}

describe("session token", () => {
  test("round-trips a valid session", async () => {
    const token = await createSessionToken(payload, secret)

    await expect(parseSessionToken(token, secret)).resolves.toEqual(payload)
  })

  test("rejects a token with an invalid signature", async () => {
    const token = await createSessionToken(payload, secret)

    await expect(parseSessionToken(token, "different-secret")).resolves.toBeNull()
  })

  test("rejects an expired token", async () => {
    const token = await sign(
      {
        ...payload,
        exp: Math.floor(Date.now() / 1000) - 1,
      },
      secret,
    )

    await expect(parseSessionToken(token, secret)).resolves.toBeNull()
  })
})
