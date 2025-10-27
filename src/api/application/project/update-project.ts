import { NameValue } from "@/api/domain/values/name.value"
import { ProjectRepository } from "@/api/infrastructure/repositories/project.repository"
import { InternalGraphQLError } from "@/api/interface/errors/internal-graphql-error"
import { NotFoundGraphQLError } from "@/api/interface/errors/not-found-graphql-error"
import type { Context } from "@/env"

type Props = {
  projectId: string
  name: string
}

/**
 * プロジェクトを更新する
 */
export class UpdateProject {
  constructor(
    readonly c: Context,
    readonly deps = {
      repository: new ProjectRepository(c),
    },
  ) {}

  async run(props: Props) {
    try {
      const project = await this.deps.repository.read(props.projectId)

      if (project === null) {
        return new NotFoundGraphQLError("プロジェクトが見つかりませんでした")
      }

      const draft = project.updateName(new NameValue(props.name))

      const result = await this.deps.repository.write(draft)

      if (result instanceof Error) {
        return new InternalGraphQLError()
      }

      return null
    } catch (_error) {
      return new InternalGraphQLError()
    }
  }
}
