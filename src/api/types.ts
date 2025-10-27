import type { z } from "zod"
import type { builder } from "@/api/interface/builder"
import type { vSessionPayload } from "@/lib/session/session-payload"

export type SchemaTypes = typeof builder.$inferSchemaTypes

export type SessionPayload = z.infer<typeof vSessionPayload>
