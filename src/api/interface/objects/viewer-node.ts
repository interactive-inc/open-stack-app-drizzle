import { eq } from "drizzle-orm"
import { builder } from "@/api/interface/builder"
import { PothosProjectMemberNode } from "@/api/interface/objects/project-member-node"
import type { User } from "@/schema"
import { projectMembers } from "@/schema"

export const PothosViewerNode = builder.objectRef<User>("ViewerNode")

builder.objectType(PothosViewerNode, {
  description: undefined,
})

builder.objectField(PothosViewerNode, "id", (t) => {
  return t.string({
    nullable: false,
    resolve(parent) {
      return parent.id
    },
  })
})

builder.objectField(PothosViewerNode, "email", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.email
    },
  })
})

builder.objectField(PothosViewerNode, "name", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.name
    },
  })
})

builder.objectField(PothosViewerNode, "createdAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.createdAt.getTime() / 1000)
    },
  })
})

builder.objectField(PothosViewerNode, "updatedAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.updatedAt.getTime() / 1000)
    },
  })
})

builder.objectField(PothosViewerNode, "projectMembers", (t) => {
  return t.field({
    type: [PothosProjectMemberNode],
    description: undefined,
    nullable: false,
    args: {
      offset: t.arg({ type: "Int", required: true }),
      limit: t.arg({ type: "Int", required: true }),
    },
    async resolve(parent, _args, c) {
      const members = await c.var.database.query.projectMembers.findMany({
        where: eq(projectMembers.userId, parent.id),
      })
      return members
    },
  })
})
