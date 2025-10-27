import { ProjectMemberEntity } from "@/api/domain/entities/project-member.entity"
import { ProjectMemberRepository } from "@/api/infrastructure/repositories/project-member.repository"
import { InternalGraphQLError } from "@/api/interface/errors/internal-graphql-error"
import type { Context } from "@/env"

type Props = {
  projectId: string
  userId: string
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
}

/**
 * プロジェクトメンバーを作成する
 */
export class CreateProjectMember {
  constructor(
    readonly c: Context,
    readonly deps = {
      repository: new ProjectMemberRepository(c),
    },
  ) {}

  async run(props: Props) {
    try {
      const memberId = crypto.randomUUID()

      const projectMember = new ProjectMemberEntity({
        id: memberId,
        projectId: props.projectId,
        userId: props.userId,
        role: props.role,
        createdAt: new Date(),
      })

      const result = await this.deps.repository.write(projectMember)

      if (result instanceof Error) {
        return new InternalGraphQLError(
          "プロジェクトメンバーの作成に失敗しました。",
        )
      }

      return projectMember
    } catch (_error) {
      return new InternalGraphQLError()
    }
  }
}
