import type { QueryFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { InternalGraphQLError } from "@/api/interface/errors/internal-graphql-error"
import { UnauthenticatedGraphQLError } from "@/api/interface/errors/unauthenticated-graphql-error"
import { PothosViewerNode } from "@/api/interface/objects/viewer-node"
import type { SchemaTypes } from "@/api/types"
import { users } from "@/schema"

/**
 * ログイン中のユーザを取得する
 */
export const viewer: QueryFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosViewerNode,
    async resolve(_, _args, c) {
      const session = c.var.session

      if (session === null) {
        throw new UnauthenticatedGraphQLError()
      }

      const user = await c.var.database.query.users.findFirst({
        where: eq(users.id, session.userId),
      })

      if (user === undefined) {
        throw new InternalGraphQLError("User not found")
      }

      return user
    },
  })
}
