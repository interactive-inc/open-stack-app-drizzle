import { z } from "zod"

export const vSessionPayload = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
})

export type SessionPayload = z.infer<typeof vSessionPayload>
