import { zValidator } from "@hono/zod-validator"
import { compareSync } from "bcrypt-ts"
import { eq } from "drizzle-orm"
import { setSignedCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { factory } from "@/api/interface/factory"
import { createSessionCookieOptions } from "@/lib/session/session-cookie"
import { vSessionPayload } from "@/lib/session/session-payload"
import { createSessionToken } from "@/lib/session/session-token"
import { drizzleUsers } from "@/schema"

export const POST = factory.createHandlers(
  zValidator(
    "json",
    z.object({
      email: z.string().trim().email().max(254),
      password: z.string().min(1).max(72),
    }),
  ),
  async (c) => {
    const json = c.req.valid("json")

    const account = await c.var.database.query.users.findFirst({
      where: eq(drizzleUsers.email, json.email),
    })

    if (account === undefined) {
      throw new HTTPException(401, {
        message: "メールアドレスかパスワードが間違っています",
      })
    }

    const result = compareSync(json.password, account.hashedPassword)

    if (result !== true) {
      throw new HTTPException(401, {
        message: "メールアドレスかパスワードが間違っています",
      })
    }

    const payload = vSessionPayload.parse({
      userId: account.id,
      name: account.name,
      email: account.email,
    } satisfies z.infer<typeof vSessionPayload>)

    const cookie = await createSessionToken(payload, c.env.JWT_SECRET)

    await setSignedCookie(
      c,
      c.env.JWT_COOKIE_KEY,
      cookie,
      c.env.JWT_COOKIE_SECRET,
      createSessionCookieOptions(c.req.url),
    )

    return c.json({ id: account.id })
  },
)
