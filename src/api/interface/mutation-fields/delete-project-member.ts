import type { MutationFieldThunk } from "@pothos/core"
import { DeleteProjectMember } from "@/api/application/project/delete-project-member"
import { UnauthenticatedGraphQLError } from "@/api/interface/errors/unauthenticated-graphql-error"
import { PothosDeleteProjectMemberInput } from "@/api/interface/inputs/delete-project-member-input"
import type { SchemaTypes } from "@/api/types"

export const deleteProjectMember: MutationFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: "ID",
    description: "プロジェクトメンバーを削除する",
    args: {
      input: t.arg({ type: PothosDeleteProjectMemberInput, required: true }),
    },
    async resolve(_, args, c) {
      if (c.var.session === null) {
        throw new UnauthenticatedGraphQLError()
      }

      const service = new DeleteProjectMember(c)

      const result = await service.run({
        projectId: args.input.projectId,
        userId: args.input.userId,
      })

      if (result instanceof Error) {
        throw result
      }

      return result.id
    },
  })
}
