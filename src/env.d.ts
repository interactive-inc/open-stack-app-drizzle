import type { DrizzleD1Database } from "drizzle-orm/d1"
import type { YogaInitialContext } from "graphql-yoga"
import type { SessionPayload } from "@/api/types"
import type { schema } from "@/schema"

export type Bindings = Env & {
  JWT_COOKIE_SECRET: string
  JWT_SECRET: string
}

export type Variables = {
  database: DrizzleD1Database<typeof schema>
  session: SessionPayload | null
}

/**
 * Hono Context
 * @example new Hono<Env>()
 */
export type HonoEnv = {
  Bindings: Bindings
  Variables: Variables
}

/**
 * Context Storage
 * https://hono.dev/docs/middleware/builtin/context-storage#context-storage-middleware
 */
export type Context = {
  var: Variables
  env: Bindings
}

export type YogaContext = YogaInitialContext & Context
