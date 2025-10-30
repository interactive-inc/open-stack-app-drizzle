import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { CreateUser } from "@/api/application/user/create-user"
import { UpdateUser } from "@/api/application/user/update-user"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import { factory } from "@/api/interface/factory"
import { drizzleUsers } from "@/schema"

// GET /users - List all users
export const GET = factory.createHandlers(async (c) => {
  const users = await c.var.database.query.users.findMany()

  return c.json(users)
})

// POST /users - Create a new user
export const POST = factory.createHandlers(
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

    const user = await c.var.database.query.users.findFirst({
      where: eq(drizzleUsers.id, result.id),
    })

    if (!user) {
      throw new HTTPException(404, { message: "User not found" })
    }

    return c.json(user)
  },
)

// PUT /users/:id - Update a user
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
