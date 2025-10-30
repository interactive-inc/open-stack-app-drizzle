import { contextStorage } from "hono/context-storage"
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
import * as project_members_$id from "@/api/interface/routes/project-members.$id"
import * as projects from "@/api/interface/routes/projects"
import * as projects_$id from "@/api/interface/routes/projects.$id"
import * as users from "@/api/interface/routes/users"

export const app = factory
  .createApp()
  .use(cors({ credentials: true, origin: (v) => v }))
  .use(contextStorage())
  .use(databaseMiddleware)
  .use(sessionMiddleware)
  .basePath("/api")
  .get("/", ...index.GET)
  .get("/auth/session", ...auth_session.GET)
  .post("/auth/sign/in", ...auth_sign_in.POST)
  .post("/auth/sign/up", ...auth_sign_up.POST)
  .post("/auth/sign/out", ...auth_sign_out.POST)
  .get("/debug/random", ...debug_random.GET)
  .post("/debug/projects", ...debug_projects.GET)
  .get("/projects", ...projects.GET)
  .post("/projects", ...projects.POST)
  .get("/projects/:id", ...projects_$id.GET)
  .put("/projects/:id", ...projects_$id.PUT)
  .delete("/projects/:id", ...projects_$id.DELETE)
  .get("/projects/:id/members", ...project_members_$id.GET)
  .post("/projects/:id/members", ...project_members_$id.POST)
  .delete("/projects/:id/members/:userId", ...project_members_$id.DELETE)
  .get("/users", ...users.GET)
  .post("/users", ...users.POST)
  .put("/users/:id", ...users.PUT)

app.onError((e, c) => {
  console.error(e)

  if (e instanceof HTTPException) {
    return c.json({ message: e.message }, { status: e.status })
  }
  return c.json({ message: e.message }, { status: 500 })
})
