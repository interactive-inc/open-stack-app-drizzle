import type { QueryFieldThunk } from "@pothos/core"
import { eq } from "drizzle-orm"
import { NotFoundGraphQLError } from "@/api/interface/errors/not-found-graphql-error"
import { PothosProjectNode } from "@/api/interface/objects/project-node"
import type { SchemaTypes } from "@/api/types"
import { projects } from "@/schema"

/**
 * プロジェクトを取得する
 */
export const project: QueryFieldThunk<SchemaTypes> = (t) => {
  return t.field({
    type: PothosProjectNode,
    args: {
      id: t.arg({ type: "ID", required: true }),
    },
    async resolve(_, args, c) {
      const project = await c.var.database.query.projects.findFirst({
        where: eq(projects.id, args.id),
      })

      if (project === undefined) {
        throw new NotFoundGraphQLError()
      }

      return project
    },
  })
}
