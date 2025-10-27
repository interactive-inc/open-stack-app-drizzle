import { eq } from "drizzle-orm"
import { builder } from "@/api/interface/builder"
import { PothosProjectMemberNode } from "@/api/interface/objects/project-member-node"
import type { User } from "@/schema"
import { projectMembers } from "@/schema"

export const PothosUserNode = builder.objectRef<User>("UserNode")

builder.objectType(PothosUserNode, {
  description: undefined,
})

builder.objectField(PothosUserNode, "id", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.id
    },
  })
})

builder.objectField(PothosUserNode, "email", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.email
    },
  })
})

builder.objectField(PothosUserNode, "name", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.name
    },
  })
})

builder.objectField(PothosUserNode, "isDeleted", (t) => {
  return t.boolean({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.deletedAt !== null
    },
  })
})

builder.objectField(PothosUserNode, "createdAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.createdAt.getTime() / 1000)
    },
  })
})

builder.objectField(PothosUserNode, "updatedAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.updatedAt.getTime() / 1000)
    },
  })
})

builder.objectField(PothosUserNode, "projectMembers", (t) => {
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
