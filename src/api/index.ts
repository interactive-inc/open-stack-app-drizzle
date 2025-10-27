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
import * as project_members_create from "@/api/interface/routes/project-members.create"
import * as project_members_delete from "@/api/interface/routes/project-members.delete"
import * as projects from "@/api/interface/routes/projects"
import * as projects_create from "@/api/interface/routes/projects.create"
import * as projects_delete from "@/api/interface/routes/projects.delete"
import * as projects_update from "@/api/interface/routes/projects.update"
import * as users_create from "@/api/interface/routes/users.create"
import * as users_update from "@/api/interface/routes/users.update"

export const app = factory
  .createApp()
  .use(cors({ credentials: true, origin: (v) => v }))
  .use(contextStorage())
  .use(databaseMiddleware)
  .use(sessionMiddleware)
  .basePath("/api")
  .get("/", index.GET)
  .get("/auth/session", auth_session.GET)
  .post("/auth/sign/in", auth_sign_in.POST)
  .post("/auth/sign/up", auth_sign_up.POST)
  .post("/auth/sign/out", auth_sign_out.POST)
  .get("/debug/random", debug_random.GET)
  .post("/debug/projects", debug_projects.GET)
  .get("/projects", projects.GET)
  .post("/projects", projects_create.POST)
  .put("/projects/:id", projects_update.PUT)
  .delete("/projects/:id", projects_delete.DELETE)
  .post("/projects/:id/members", project_members_create.POST)
  .delete("/projects/:id/members/:userId", project_members_delete.DELETE)
  .post("/users", users_create.POST)
  .put("/users/:id", users_update.PUT)

app.onError((e, c) => {
  if (e instanceof HTTPException) {
    return c.json({ message: e.message }, { status: e.status })
  }
  return c.json({ message: e.message }, { status: 500 })
})
