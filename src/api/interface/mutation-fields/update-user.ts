import type { MutationFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { UpdateUser } from "@/api/application/user/update-user"
import { UnauthenticatedGraphQLError } from "@/api/interface/errors/unauthenticated-graphql-error"
import { PothosUpdateUserInput } from "@/api/interface/inputs/update-user-input"
import { PothosUserNode } from "@/api/interface/objects/user-node"
import type { SchemaTypes } from "@/api/types"
import { users } from "@/schema"

/**
 * ユーザー情報を更新する
 */
export const updateUser: MutationFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosUserNode,
    description: "ユーザー情報を更新する",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: PothosUpdateUserInput, required: true }),
    },
    async resolve(_, args, c) {
      if (c.var.session === null) {
        throw new UnauthenticatedGraphQLError()
      }

      const service = new UpdateUser(c)

      const result = await service.run({
        id: args.id,
        name: args.input.name,
        email: args.input.email,
        displayName: args.input.displayName,
        login: args.input.login,
      })

      if (result instanceof Error) {
        throw result
      }

      const user = await c.var.database.query.users.findFirst({
        where: eq(users.id, args.id),
      })

      if (user === undefined) {
        throw new Error("User not found")
      }

      return user
    },
  })
}
