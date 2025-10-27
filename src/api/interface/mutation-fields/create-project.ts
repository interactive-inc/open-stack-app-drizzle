import type { MutationFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { CreateProject } from "@/api/application/project/create-project"
import { UnauthenticatedGraphQLError } from "@/api/interface/errors/unauthenticated-graphql-error"
import { PothosCreateProjectInput } from "@/api/interface/inputs/create-project-input"
import { PothosProjectNode } from "@/api/interface/objects/project-node"
import type { SchemaTypes } from "@/api/types"
import { projects } from "@/schema"

export const createProject: MutationFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosProjectNode,
    description: "新しいプロジェクトを作成する",
    args: {
      input: t.arg({ type: PothosCreateProjectInput, required: true }),
    },
    async resolve(_, args, c) {
      if (c.var.session === null) {
        throw new UnauthenticatedGraphQLError()
      }

      const service = new CreateProject(c)

      const result = await service.run({
        userId: c.var.session.userId,
        name: args.input.name,
      })

      if (result instanceof Error) {
        throw result
      }

      const project = await c.var.database.query.projects.findFirst({
        where: eq(projects.id, result.id),
      })

      if (project === undefined) {
        throw new Error("Project not found")
      }

      return project
    },
  })
}
