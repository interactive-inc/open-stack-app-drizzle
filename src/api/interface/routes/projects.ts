import { factory } from "@/api/interface/factory"

export const [GET] = factory.createHandlers(async (c) => {
  const projects = await c.var.database.query.projects.findMany()

  return c.json(projects)
})
