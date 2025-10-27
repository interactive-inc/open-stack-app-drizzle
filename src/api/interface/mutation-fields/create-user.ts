import type { MutationFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { CreateUser } from "@/api/application/user/create-user"
import { PothosCreateUserInput } from "@/api/interface/inputs/create-user-input"
import { PothosUserNode } from "@/api/interface/objects/user-node"
import type { SchemaTypes } from "@/api/types"
import type { User } from "@/schema"
import { users } from "@/schema"

export const createUser: MutationFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosUserNode,
    description: "新しいユーザーを作成する",
    args: {
      input: t.arg({ type: PothosCreateUserInput, required: true }),
    },
    async resolve(_, args, c): Promise<User> {
      const service = new CreateUser(c)

      const result = await service.run({
        email: args.input.email,
        password: args.input.password,
      })

      if (result instanceof Error) {
        throw result
      }

      const user = await c.var.database.query.users.findFirst({
        where: eq(users.id, result.id),
      })

      if (user === undefined) {
        throw new Error("User not found")
      }

      return user
    },
  })
}
