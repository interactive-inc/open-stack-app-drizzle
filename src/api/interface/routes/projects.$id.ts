import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { DeleteProject } from "@/api/application/project/delete-project"
import { UpdateProject } from "@/api/application/project/update-project"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"
import type { DrizzleProject } from "@/schema"
import { drizzleProjects } from "@/schema"

export type ProjectByIdResult = DrizzleProject

// GET /projects/:id - Get a specific project
export const GET = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")

    const project = await c.var.database.query.projects.findFirst({
      where: eq(drizzleProjects.id, param.id),
    })

    if (!project) {
      throw new HTTPException(404, { message: "Project not found" })
    }

    return c.json(project)
  },
)

// PUT /projects/:id - Update a project
export const PUT = factory.createHandlers(
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
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")
    const json = c.req.valid("json")

    const session = c.var.session

    if (session === null) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    const updateProject = new UpdateProject(c)

    const result = await updateProject.run({
      projectId: param.id,
      name: json.name,
    })

    if (result instanceof NotFoundError) {
      throw new HTTPException(404, { message: result.message })
    }

    if (result instanceof InternalError) {
      throw new HTTPException(500, { message: result.message })
    }

    return c.json({ success: true })
  },
)

// DELETE /projects/:id - Delete a project
export const DELETE = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")

    const session = c.var.session

    if (session === null) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    const deleteProject = new DeleteProject(c)

    const result = await deleteProject.run({
      projectId: param.id,
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
