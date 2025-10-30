import { and, eq } from "drizzle-orm"
import { ProjectMemberEntity } from "@/api/domain/entities/project-member.entity"
import type { Context } from "@/env"
import { drizzleProjectMembers } from "@/schema"

export class ProjectMemberRepository {
  constructor(readonly c: Context) {}

  async write(entity: ProjectMemberEntity) {
    try {
      const existingMember =
        await this.c.var.database.query.projectMembers.findFirst({
          where: eq(drizzleProjectMembers.id, entity.id),
        })

      if (existingMember === undefined) {
        await this.c.var.database.insert(drizzleProjectMembers).values({
          id: entity.id,
          projectId: entity.projectId,
          userId: entity.userId,
          role: entity.role,
          createdAt: entity.createdAt,
        })
      } else {
        await this.c.var.database
          .update(drizzleProjectMembers)
          .set({
            projectId: entity.projectId,
            userId: entity.userId,
            role: entity.role,
          })
          .where(eq(drizzleProjectMembers.id, entity.id))
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
          eq(drizzleProjectMembers.projectId, projectId),
          eq(drizzleProjectMembers.userId, userId),
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
