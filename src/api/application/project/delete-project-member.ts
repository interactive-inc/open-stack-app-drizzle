import { eq } from "drizzle-orm"
import { ProjectMemberRepository } from "@/api/infrastructure/repositories/project-member.repository"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import type { Context } from "@/env"
import { drizzleProjectMembers } from "@/schema"

type Props = {
  projectId: string
  userId: string
}

/**
 * プロジェクトメンバーを削除する
 */
export class DeleteProjectMember {
  constructor(
    readonly c: Context,
    readonly deps = {
      repository: new ProjectMemberRepository(c),
    },
  ) {}

  async run(props: Props) {
    try {
      const projectMember = await this.deps.repository.read(
        props.projectId,
        props.userId,
      )

      if (projectMember === null) {
        return new NotFoundError("プロジェクトメンバーが見つかりませんでした。")
      }

      await this.c.var.database
        .delete(drizzleProjectMembers)
        .where(eq(drizzleProjectMembers.id, projectMember.id))

      return { id: projectMember.id }
    } catch (_error) {
      return new InternalError()
    }
  }
}
