import type { QueryFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { NotFoundGraphQLError } from "@/api/interface/errors/not-found-graphql-error"
import { PothosUserNode } from "@/api/interface/objects/user-node"
import type { SchemaTypes } from "@/api/types"
import { users } from "@/schema"

/**
 * ユーザーを取得する
 */
export const user: QueryFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosUserNode,
    args: {
      id: t.arg({ type: "ID", required: true }),
    },
    async resolve(_, args, c) {
      const user = await c.var.database.query.users.findFirst({
        where: eq(users.id, args.id),
      })

      if (user === undefined) {
        throw new NotFoundGraphQLError()
      }

      return user
    },
  })
}
