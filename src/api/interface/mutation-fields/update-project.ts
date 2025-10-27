import type { MutationFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { UpdateProject } from "@/api/application/project/update-project"
import { UnauthenticatedGraphQLError } from "@/api/interface/errors/unauthenticated-graphql-error"
import { PothosUpdateProjectInput } from "@/api/interface/inputs/update-project-input"
import { PothosProjectNode } from "@/api/interface/objects/project-node"
import type { SchemaTypes } from "@/api/types"
import { projects } from "@/schema"

export const updateProject: MutationFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosProjectNode,
    description: "プロジェクトを更新する",
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: PothosUpdateProjectInput, required: true }),
    },
    async resolve(_, args, c) {
      if (c.var.session === null) {
        throw new UnauthenticatedGraphQLError()
      }

      const service = new UpdateProject(c)

      const result = await service.run({
        projectId: args.id,
        name: args.input.name,
      })

      if (result instanceof Error) {
        throw result
      }

      const project = await c.var.database.query.projects.findFirst({
        where: eq(projects.id, args.id),
      })

      if (project === undefined) {
        throw new Error("Project not found")
      }

      return project
    },
  })
}
