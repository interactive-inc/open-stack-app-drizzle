import { createYoga } from "graphql-yoga"
import { contextStorage, getContext } from "hono/context-storage"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"
import { factory } from "@/api/interface/factory"
import { databaseMiddleware } from "@/api/interface/middlewares/database-middleware"
import { sessionMiddleware } from "@/api/interface/middlewares/session-middleware"
import * as auth_session from "@/api/interface/routes/auth.session"
import * as auth_sign_in from "@/api/interface/routes/auth.sign.in"
import * as auth_sign_out from "@/api/interface/routes/auth.sign.out"
import * as auth_sign_up from "@/api/interface/routes/auth.sign.up"
import * as debug_projects from "@/api/interface/routes/debug.projects"
import * as debug_random from "@/api/interface/routes/debug.random"
import * as index from "@/api/interface/routes/index"
import * as projects from "@/api/interface/routes/projects"
import { schema } from "@/api/interface/schema"
import type { HonoEnv, YogaContext } from "@/env"

/**
 * GraphQL
 */
const graphql = createYoga({
  schema,
  graphqlEndpoint: "/",
  landingPage: false,
  logging: "info",
  cors: { origin: "*", credentials: true },
  context(context): YogaContext {
    const honoContext = getContext<HonoEnv>()
    return {
      ...context,
      var: honoContext.var,
      env: honoContext.env,
    }
  },
})

export const app = factory
  .createApp()
  .use(cors({ credentials: true, origin: (v) => v }))
  .use(contextStorage())
  .use(databaseMiddleware)
  .use(sessionMiddleware)
  .mount("/graphql", graphql)
  .basePath("/api")
  .get("/", index.GET)
  .get("/auth/session", auth_session.GET)
  .post("/auth/sign/in", auth_sign_in.POST)
  .post("/auth/sign/up", auth_sign_up.POST)
  .post("/auth/sign/out", auth_sign_out.POST)
  .get("/debug/random", debug_random.GET)
  .post("/debug/projects", debug_projects.GET)
  .get("/projects", projects.GET)

app.onError((e, c) => {
  if (e instanceof HTTPException) {
    return c.json({ message: e.message }, { status: e.status })
  }
  return c.json({ message: e.message }, { status: 500 })
})
