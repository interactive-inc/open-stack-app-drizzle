import type { z } from "zod"
import type { vSessionPayload } from "@/lib/session/session-payload"

export type SessionPayload = z.infer<typeof vSessionPayload>
