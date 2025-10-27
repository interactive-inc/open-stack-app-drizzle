import { eq } from "drizzle-orm"
import { ProjectEntity } from "@/api/domain/entities/project.entity"
import { NameValue } from "@/api/domain/values/name.value"
import { ProjectRepository } from "@/api/infrastructure/repositories/project.repository"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import type { Context } from "@/env"
import { schema } from "@/schema"

type Props = {
  userId: string
  name: string
  nameEN?: string | null
}

export class CreateProject {
  constructor(
    readonly c: Context,
    readonly deps = {
      repository: new ProjectRepository(c),
    },
  ) {}

  async run(props: Props) {
    try {
      const user = await this.c.var.database.query.projects.findFirst({
        where: eq(schema.projects.id, props.userId),
      })

      if (user === null) {
        return new NotFoundError("ユーザーが見つかりません。")
      }

      const projectId = crypto.randomUUID()

      const project = new ProjectEntity({
        id: projectId,
        login: projectId,
        name: new NameValue(props.name),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const writeResult = await this.deps.repository.write(project)

      if (writeResult instanceof Error) {
        return new InternalError("プロジェクトの作成に失敗しました。")
      }

      await this.c.var.database.insert(schema.projectMembers).values({
        id: crypto.randomUUID(),
        projectId: project.id,
        userId: props.userId,
        role: "OWNER",
        createdAt: new Date(),
      })

      return project
    } catch (_error) {
      return new InternalError()
    }
  }
}
