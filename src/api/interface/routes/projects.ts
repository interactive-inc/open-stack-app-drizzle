import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { CreateProject } from "@/api/application/project/create-project"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"
import { drizzleProjects } from "@/schema"

// GET /projects - List all projects
export const GET = factory.createHandlers(async (c) => {
  const projects = await c.var.database.query.projects.findMany()

  return c.json(projects)
})

// POST /projects - Create a new project
export const POST = factory.createHandlers(
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

    const project = await c.var.database.query.projects.findFirst({
      where: eq(drizzleProjects.id, result.id),
    })

    if (!project) {
      throw new HTTPException(404, { message: "Project not found" })
    }

    return c.json(project)
  },
)
