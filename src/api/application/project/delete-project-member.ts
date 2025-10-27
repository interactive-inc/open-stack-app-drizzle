import { eq } from "drizzle-orm"
import { ProjectMemberRepository } from "@/api/infrastructure/repositories/project-member.repository"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import type { Context } from "@/env"
import { projectMembers } from "@/schema"

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
        .delete(projectMembers)
        .where(eq(projectMembers.id, props.userId))

      return { id: props.userId }
    } catch (_error) {
      return new InternalError()
    }
  }
}
