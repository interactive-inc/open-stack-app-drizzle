import { eq } from "drizzle-orm"
import { ProjectEntity } from "@/api/domain/entities/project.entity"
import { NameValue } from "@/api/domain/values/name.value"
import type { Context } from "@/env"
import { projects } from "@/schema"

export class ProjectRepository {
  constructor(readonly c: Context) {}

  async write(entity: ProjectEntity) {
    try {
      const existingProject =
        await this.c.var.database.query.projects.findFirst({
          where: eq(projects.id, entity.id),
        })

      if (existingProject === undefined) {
        await this.c.var.database.insert(projects).values({
          id: entity.id,
          login: entity.login,
          name: entity.name.value,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          deletedAt: entity.deletedAt,
        })
      } else {
        await this.c.var.database
          .update(projects)
          .set({
            login: entity.login,
            name: entity.name.value,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
          })
          .where(eq(projects.id, entity.id))
      }

      return null
    } catch (error) {
      console.error(error)
      return new Error()
    }
  }

  async read(id: string): Promise<ProjectEntity | null> {
    try {
      const data = await this.c.var.database.query.projects.findFirst({
        where: eq(projects.id, id),
      })

      if (data === undefined) {
        return null
      }

      return new ProjectEntity({
        id: data.id,
        login: data.login,
        name: new NameValue(data.name),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
