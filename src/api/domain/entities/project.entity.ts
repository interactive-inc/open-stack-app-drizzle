import { z } from "zod"
import { NameValue } from "@/api/domain/values/name.value"

const zProps = z.object({
  id: z.string(),
  login: z.string(),
  name: z.instanceof(NameValue),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

type Props = z.infer<typeof zProps>

/**
 * プロジェクト
 */
export class ProjectEntity implements Props {
  readonly id!: Props["id"]
  readonly login!: Props["login"]
  readonly name!: Props["name"]
  readonly createdAt!: Props["createdAt"]
  readonly updatedAt!: Props["updatedAt"]
  readonly deletedAt!: Props["deletedAt"]

  constructor(readonly props: Props) {
    Object.assign(this, zProps.parse(props))
  }

  /**
   * プロジェクト名を更新する
   */
  updateName(name: NameValue) {
    return new ProjectEntity({
      ...this.props,
      name,
      updatedAt: new Date(),
    })
  }

  /**
   * プロジェクトのログイン名を更新する
   */
  updateLogin(login: string) {
    return new ProjectEntity({
      ...this.props,
      login,
      updatedAt: new Date(),
    })
  }

  /**
   * プロジェクトを削除する
   */
  delete() {
    return new ProjectEntity({
      ...this.props,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
