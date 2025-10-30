import type { InferSelectModel } from "drizzle-orm"
import { relations } from "drizzle-orm"
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"

export const drizzleUsers = sqliteTable("users", {
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

export type DrizzleUser = InferSelectModel<typeof drizzleUsers>

export const usersRelations = relations(drizzleUsers, ({ many }) => ({
  projectMembers: many(drizzleProjectMembers),
}))

export const drizzleProjects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  login: text("login").notNull().unique(),
  name: text("name").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
})

export type DrizzleProject = InferSelectModel<typeof drizzleProjects>

export const projectsRelations = relations(drizzleProjects, ({ many }) => ({
  projectMembers: many(drizzleProjectMembers),
}))

export const drizzleProjectMembers = sqliteTable(
  "project_members",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => drizzleProjects.id),
    userId: text("user_id")
      .notNull()
      .references(() => drizzleUsers.id),
    role: text("role").notNull().default("OWNER"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [unique().on(table.projectId, table.userId)],
)

export type DrizzleProjectMember = InferSelectModel<
  typeof drizzleProjectMembers
>

export const projectMembersRelations = relations(
  drizzleProjectMembers,
  ({ one }) => ({
    project: one(drizzleProjects, {
      fields: [drizzleProjectMembers.projectId],
      references: [drizzleProjects.id],
    }),
    user: one(drizzleUsers, {
      fields: [drizzleProjectMembers.userId],
      references: [drizzleUsers.id],
    }),
  }),
)

export const schema = {
  users: drizzleUsers,
  projects: drizzleProjects,
  projectMembers: drizzleProjectMembers,
  usersRelations,
  projectsRelations,
  projectMembersRelations,
}
