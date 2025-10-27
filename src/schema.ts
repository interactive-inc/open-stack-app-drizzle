import type { InferSelectModel } from "drizzle-orm"
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  login: text("login").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  login: text("login").notNull().unique(),
  name: text("name").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const projectMembers = sqliteTable(
  "project_members",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull().default("OWNER"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [unique().on(table.projectId, table.userId)],
)

export const schema = {
  users,
  projects,
  projectMembers,
}

export type User = InferSelectModel<typeof users>
export type Project = InferSelectModel<typeof projects>
export type ProjectMember = InferSelectModel<typeof projectMembers>
