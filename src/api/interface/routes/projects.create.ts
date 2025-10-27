import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { CreateProject } from "@/api/application/project/create-project"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"

export const [POST] = factory.createHandlers(
  zValidator(
    "json",
    z.object({
      userId: z.string(),
      name: z.string(),
      nameEN: z.string().optional().nullable(),
    }),
  ),
  async (c) => {
    const json = c.req.valid("json")

    const session = c.var.session

    if (session === null) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    const createProject = new CreateProject(c)

    const result = await createProject.run({
      userId: json.userId,
      name: json.name,
      nameEN: json.nameEN,
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
