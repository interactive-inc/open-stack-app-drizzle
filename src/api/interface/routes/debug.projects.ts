import { factory } from "@/api/interface/factory"
import { schema } from "@/schema"

export const GET = factory.createHandlers(async (c) => {
  const project = await c.var.database
    .insert(schema.projects)
    .values({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      login: crypto.randomUUID(),
      name: crypto.randomUUID(),
    })
    .returning()

  return c.json(project)
})
