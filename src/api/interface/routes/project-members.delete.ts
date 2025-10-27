import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { DeleteProjectMember } from "@/api/application/project/delete-project-member"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"

export const [DELETE] = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
      userId: z.string(),
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")

    const session = c.var.session

    if (session === null) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    const deleteProjectMember = new DeleteProjectMember(c)

    const result = await deleteProjectMember.run({
      projectId: param.id,
      userId: param.userId,
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
