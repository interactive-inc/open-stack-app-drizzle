import { builder } from "@/api/interface/builder"

export const PothosDeleteProjectMemberInput = builder.inputType(
  "DeleteProjectMemberInput",
  {
    description: undefined,
    fields(t) {
      return {
        projectId: t.string({ required: true }),
        userId: t.string({ required: true }),
      }
    },
  },
)
