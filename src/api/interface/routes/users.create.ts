import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { CreateUser } from "@/api/application/user/create-user"
import { InternalError } from "@/api/interface/errors/internal-error"
import { factory } from "@/api/interface/factory"

export const [POST] = factory.createHandlers(
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
  ),
  async (c) => {
    const json = c.req.valid("json")

    const createUser = new CreateUser(c)

    const result = await createUser.run({
      email: json.email,
      password: json.password,
    })

    if (result instanceof InternalError) {
      throw new HTTPException(500, { message: result.message })
    }

    return c.json({ id: result.id })
  },
)
