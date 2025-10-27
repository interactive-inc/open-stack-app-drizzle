import { z } from "zod"

export const vSessionPayload = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
})
