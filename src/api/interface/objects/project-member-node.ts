import { eq } from "drizzle-orm"
import { builder } from "@/api/interface/builder"
import { PothosProjectNode } from "@/api/interface/objects/project-node"
import { PothosUserNode } from "@/api/interface/objects/user-node"
import type { ProjectMember } from "@/schema"
import { projects, users } from "@/schema"

export const PothosProjectMemberNode =
  builder.objectRef<ProjectMember>("ProjectMemberNode")

builder.objectType(PothosProjectMemberNode, {
  description: undefined,
})

builder.objectField(PothosProjectMemberNode, "id", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.id
    },
  })
})

builder.objectField(PothosProjectMemberNode, "projectId", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.projectId
    },
  })
})

builder.objectField(PothosProjectMemberNode, "project", (t) => {
  return t.field({
    type: PothosProjectNode,
    description: undefined,
    nullable: false,
    async resolve(parent, _, c) {
      const project = await c.var.database.query.projects.findFirst({
        where: eq(projects.id, parent.projectId),
      })
      if (project === undefined) {
        throw new Error("Project not found")
      }
      return project
    },
  })
})

builder.objectField(PothosProjectMemberNode, "userId", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.userId
    },
  })
})

builder.objectField(PothosProjectMemberNode, "user", (t) => {
  return t.field({
    type: PothosUserNode,
    description: undefined,
    nullable: false,
    async resolve(parent, _, c) {
      const user = await c.var.database.query.users.findFirst({
        where: eq(users.id, parent.userId),
      })
      if (user === undefined) {
        throw new Error("User not found")
      }
      return user
    },
  })
})

builder.objectField(PothosProjectMemberNode, "role", (t) => {
  return t.string({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return parent.role
    },
  })
})

builder.objectField(PothosProjectMemberNode, "createdAt", (t) => {
  return t.int({
    description: undefined,
    nullable: false,
    resolve(parent) {
      return Math.floor(parent.createdAt.getTime() / 1000)
    },
  })
})
