import type { MutationFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { CreateProjectMember } from "@/api/application/project/create-project-member"
import { UnauthenticatedGraphQLError } from "@/api/interface/errors/unauthenticated-graphql-error"
import { PothosProjectMemberInput } from "@/api/interface/inputs/create-project-member-input"
import { PothosProjectMemberNode } from "@/api/interface/objects/project-member-node"
import type { SchemaTypes } from "@/api/types"
import { projectMembers } from "@/schema"

export const createProjectMember: MutationFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosProjectMemberNode,
    description: "プロジェクトのメンバーを作成する",
    args: {
      input: t.arg({ type: PothosProjectMemberInput, required: true }),
    },
    async resolve(_, args, c) {
      if (c.var.session === null) {
        throw new UnauthenticatedGraphQLError()
      }

      const service = new CreateProjectMember(c)

      const result = await service.run({
        projectId: args.input.projectId,
        userId: args.input.userId,
        role: args.input.role as never,
      })

      if (result instanceof Error) {
        throw result
      }

      const member = await c.var.database.query.projectMembers.findFirst({
        where: eq(projectMembers.id, result.id),
      })

      if (member === undefined) {
        throw new Error("ProjectMember not found")
      }

      return member
    },
  })
}
