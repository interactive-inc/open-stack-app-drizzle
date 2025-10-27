import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { CreateProjectMember } from "@/api/application/project/create-project-member"
import { InternalError } from "@/api/interface/errors/internal-error"
import { factory } from "@/api/interface/factory"

export const [POST] = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  zValidator(
    "json",
    z.object({
      userId: z.string(),
      role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")
    const json = c.req.valid("json")

    const session = c.var.session

    if (session === null) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    const createProjectMember = new CreateProjectMember(c)

    const result = await createProjectMember.run({
      projectId: param.id,
      userId: json.userId,
      role: json.role,
    })

    if (result instanceof InternalError) {
      throw new HTTPException(500, { message: result.message })
    }

    return c.json(result)
  },
)
