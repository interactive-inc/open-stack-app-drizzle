import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { CreateProjectMember } from "@/api/application/project/create-project-member"
import { DeleteProjectMember } from "@/api/application/project/delete-project-member"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"
import type { DrizzleProjectMember, DrizzleUser } from "@/schema"
import { drizzleProjectMembers } from "@/schema"

export type ProjectMemberWithUser = DrizzleProjectMember & {
  user: DrizzleUser
}

export type ProjectMembersResult = ProjectMemberWithUser[]

// GET /projects/:id/members - List project members
export const GET = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const param = c.req.valid("param")

    const members = await c.var.database.query.projectMembers.findMany({
      where: eq(drizzleProjectMembers.projectId, param.id),
      with: {
        user: true,
      },
    })

    return c.json(members)
  },
)

// POST /projects/:id/members - Add a project member
export const POST = factory.createHandlers(
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

    const member = await c.var.database.query.projectMembers.findFirst({
      where: eq(drizzleProjectMembers.id, result.id),
      with: {
        user: true,
      },
    })

    if (!member) {
      throw new HTTPException(404, { message: "Project member not found" })
    }

    return c.json(member)
  },
)

// DELETE /projects/:id/members/:userId - Remove a project member
export const DELETE = factory.createHandlers(
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
