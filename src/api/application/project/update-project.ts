import { NameValue } from "@/api/domain/values/name.value"
import { ProjectRepository } from "@/api/infrastructure/repositories/project.repository"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
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
        return new NotFoundError("プロジェクトが見つかりませんでした")
      }

      const draft = project.updateName(new NameValue(props.name))

      const result = await this.deps.repository.write(draft)

      if (result instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (_error) {
      return new InternalError()
    }
  }
}
