import { NameValue } from "@/api/domain/values/name.value"
import { UserRepository } from "@/api/infrastructure/repositories/user.repository"
import { InternalError } from "@/api/interface/errors/internal-error"
import { NotFoundError } from "@/api/interface/errors/not-found-error"
import type { Context } from "@/env"

/**
 * ユーザー更新のパラメータ
 */
type Props = {
  id: string
  name: string
  email: string
  login: string
  displayName: string
}

/**
 * ユーザー情報を更新する
 */
export class UpdateUser {
  constructor(
    readonly c: Context,
    readonly deps = {
      repository: new UserRepository(c),
    },
  ) {}

  async run(props: Props) {
    try {
      const user = await this.deps.repository.read(props.id)

      if (user === null) {
        return new NotFoundError("指定されたユーザーが存在しません。")
      }

      const draft = user
        .updateName(new NameValue(props.name))
        .updateEmail(props.email)
        .updateLogin(props.login)

      const result = await this.deps.repository.write(draft)

      if (result instanceof Error) {
        return new InternalError()
      }

      return user
    } catch (_error) {
      return new InternalError()
    }
  }
}
