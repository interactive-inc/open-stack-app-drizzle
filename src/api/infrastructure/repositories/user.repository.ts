import { eq } from "drizzle-orm"
import { UserEntity } from "@/api/domain/entities/user.entity"
import { NameValue } from "@/api/domain/values/name.value"
import type { Context } from "@/env"
import { drizzleUsers } from "@/schema"

export class UserRepository {
  constructor(readonly c: Context) {}

  async write(entity: UserEntity) {
    try {
      const existingUser = await this.c.var.database.query.users.findFirst({
        where: eq(drizzleUsers.id, entity.id),
      })

      if (existingUser === undefined) {
        await this.c.var.database.insert(drizzleUsers).values({
          id: entity.id,
          login: entity.login,
          email: entity.email,
          name: entity.name.value,
          hashedPassword: entity.hashedPassword,
          deletedAt: entity.deletedAt,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })
      } else {
        await this.c.var.database
          .update(drizzleUsers)
          .set({
            login: entity.login,
            email: entity.email,
            name: entity.name.value,
            hashedPassword: entity.hashedPassword,
          })
          .where(eq(drizzleUsers.id, entity.id))
      }

      return null
    } catch (error) {
      console.error(error)
      return new Error()
    }
  }

  async read(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.c.var.database.query.users.findFirst({
        where: eq(drizzleUsers.id, id),
      })

      if (user === undefined) {
        return null
      }

      return new UserEntity({
        id: user.id,
        login: user.login,
        email: user.email,
        name: new NameValue(user.name),
        hashedPassword: user.hashedPassword,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
        deletedAt: user.deletedAt,
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
