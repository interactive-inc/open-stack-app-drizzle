import { z } from "zod"

const zProps = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.date(),
})

type Props = z.infer<typeof zProps>

export class ProjectMemberEntity implements Props {
  readonly id!: Props["id"]
  readonly projectId!: Props["projectId"]
  readonly userId!: Props["userId"]
  readonly role!: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
  readonly createdAt!: Props["createdAt"]

  constructor(readonly props: Props) {
    Object.assign(this, zProps.parse(props))
  }
}
