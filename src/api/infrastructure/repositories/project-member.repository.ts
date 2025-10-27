import { and, eq } from "drizzle-orm"
import { ProjectMemberEntity } from "@/api/domain/entities/project-member.entity"
import type { Context } from "@/env"
import { projectMembers } from "@/schema"

export class ProjectMemberRepository {
  constructor(readonly c: Context) {}

  async write(entity: ProjectMemberEntity) {
    try {
      const existingMember =
        await this.c.var.database.query.projectMembers.findFirst({
          where: eq(projectMembers.id, entity.id),
        })

      if (existingMember === undefined) {
        await this.c.var.database.insert(projectMembers).values({
          id: entity.id,
          projectId: entity.projectId,
          userId: entity.userId,
          role: entity.role,
          createdAt: entity.createdAt,
        })
      } else {
        await this.c.var.database
          .update(projectMembers)
          .set({
            projectId: entity.projectId,
            userId: entity.userId,
            role: entity.role,
          })
          .where(eq(projectMembers.id, entity.id))
      }

      return null
    } catch (error) {
      console.error(error)
      return error instanceof Error
        ? error
        : new Error("プロジェクトメンバーの保存に失敗しました")
    }
  }

  async read(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberEntity | null> {
    try {
      const data = await this.c.var.database.query.projectMembers.findFirst({
        where: and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId),
        ),
      })

      if (data === undefined) {
        return null
      }

      return new ProjectMemberEntity({
        id: data.id,
        projectId: data.projectId,
        userId: data.userId,
        role: data.role as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
        createdAt: data.createdAt,
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
