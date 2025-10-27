import { eq } from "drizzle-orm"
import { builder } from "@/api/interface/builder"
import { PothosProjectMemberNode } from "@/api/interface/objects/project-member-node"
import type { Project } from "@/schema"
import { projectMembers } from "@/schema"

export const PothosProjectNode = builder.objectRef<Project>("ProjectNode")

builder.objectType(PothosProjectNode, {
  description: undefined,
})

builder.objectField(PothosProjectNode, "id", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.id
    },
  })
})

builder.objectField(PothosProjectNode, "name", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.name
    },
  })
})

builder.objectField(PothosProjectNode, "createdAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.createdAt.getTime() / 1000)
    },
  })
})

builder.objectField(PothosProjectNode, "updatedAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.updatedAt.getTime() / 1000)
    },
  })
})

builder.objectField(PothosProjectNode, "members", (t) => {
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
        where: eq(projectMembers.projectId, parent.id),
      })
      return members
    },
  })
})
