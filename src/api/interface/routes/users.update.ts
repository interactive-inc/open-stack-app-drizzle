import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { UpdateUser } from "@/api/application/user/update-user"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"

export const [PUT] = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  zValidator(
    "json",
    z.object({
      name: z.string(),
      email: z.string().email(),
      login: z.string(),
      displayName: z.string(),
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")
    const json = c.req.valid("json")

    const session = c.var.session

    if (session === null) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    const updateUser = new UpdateUser(c)

    const result = await updateUser.run({
      id: param.id,
      name: json.name,
      email: json.email,
      login: json.login,
      displayName: json.displayName,
    })

    if (result instanceof NotFoundError) {
      throw new HTTPException(404, { message: result.message })
    }

    if (result instanceof InternalError) {
      throw new HTTPException(500, { message: result.message })
    }

    return c.json(result)
  },
)
