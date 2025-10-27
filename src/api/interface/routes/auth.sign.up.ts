import { zValidator } from "@hono/zod-validator"
import { hashSync } from "bcrypt-ts"
import { eq } from "drizzle-orm"
import { setSignedCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { sign } from "hono/jwt"
import { z } from "zod"
import { factory } from "@/api/interface/factory"
import { vSessionPayload } from "@/lib/session/session-payload"
import { users } from "@/schema"

export const [POST] = factory.createHandlers(
  zValidator(
    "json",
    z.object({
      email: z.string(),
      password: z.string(),
    }),
  ),
  async (c) => {
    const json = c.req.valid("json")

    const existingAccount = await c.var.database.query.users.findFirst({
      where: eq(users.email, json.email),
    })

    if (existingAccount !== undefined) {
      throw new HTTPException(409, {
        message: "このメールアドレスは既に使用されています",
      })
    }

    const hashedPassword = hashSync(json.password, 10)

    const userId = crypto.randomUUID()

    await c.var.database.insert(users).values({
      id: userId,
      login: userId,
      email: json.email,
      hashedPassword: hashedPassword,
      name: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })

    const account = await c.var.database.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (account === undefined) {
      throw new HTTPException(500, {
        message: "アカウント作成に失敗しました",
      })
    }

    const payload = vSessionPayload.parse({
      userId: account.id,
      name: "foo",
      email: account.email,
    } satisfies z.infer<typeof vSessionPayload>)

    const cookie = await sign(payload, c.env.JWT_SECRET)

    await setSignedCookie(
      c,
      c.env.JWT_COOKIE_KEY,
      cookie,
      c.env.JWT_COOKIE_SECRET,
      {
        /**
         * クライアントのJavaScriptから参照できないようにする
         */
        httpOnly: true,
        /**
         * HTTPS通信のみでCookieを送信する
         */
        secure: true,
      },
    )

    return c.json({ id: account.id })
  },
)
