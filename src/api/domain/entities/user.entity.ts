import { z } from "zod"
import { NameValue } from "@/api/domain/values/name.value"

const zProps = z.object({
  id: z.string(),
  login: z.string(),
  email: z.string(),
  name: z.instanceof(NameValue),
  hashedPassword: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

type Props = z.infer<typeof zProps>

/**
 * ユーザー
 */
export class UserEntity implements Props {
  readonly id!: Props["id"]

  readonly login!: Props["login"]

  readonly email!: Props["email"]

  readonly name!: Props["name"]

  readonly hashedPassword!: Props["hashedPassword"]

  readonly createdAt!: Props["createdAt"]

  readonly updatedAt!: Props["updatedAt"]

  readonly deletedAt!: Props["deletedAt"]

  constructor(private readonly props: Props) {
    zProps.parse(props)
    Object.assign(this, props)
  }

  /**
   * ユーザー名を更新する
   */
  updateName(name: NameValue) {
    return new UserEntity({ ...this.props, name })
  }

  /**
   * メールアドレスを更新する
   */
  updateEmail(email: string) {
    return new UserEntity({ ...this.props, email })
  }

  /**
   * ユーザー名を更新する
   */
  updateLogin(login: string) {
    return new UserEntity({ ...this.props, login: login })
  }

  /**
   * パスワードハッシュを更新する
   */
  updateHashedPassword(hashedPassword: string) {
    return new UserEntity({ ...this.props, hashedPassword })
  }
}
