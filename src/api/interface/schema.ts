import { builder } from "@/api/interface/builder"
import { createProject } from "@/api/interface/mutation-fields/create-project"
import { createProjectMember } from "@/api/interface/mutation-fields/create-project-member"
import { createUser } from "@/api/interface/mutation-fields/create-user"
import { deleteProject } from "@/api/interface/mutation-fields/delete-project"
import { updateProject } from "@/api/interface/mutation-fields/update-project"
import { updateUser } from "@/api/interface/mutation-fields/update-user"
import { project } from "@/api/interface/query-fields/project"
import { user } from "@/api/interface/query-fields/user"
import { viewer } from "@/api/interface/query-fields/viewer"

builder.queryType({
  fields(t) {
    return {
      project: project(t),
      user: user(t),
      viewer: viewer(t),
    }
  },
})

builder.mutationType({
  fields(t) {
    return {
      createProject: createProject(t),
      createProjectMember: createProjectMember(t),
      createUser: createUser(t),
      deleteProject: deleteProject(t),
      updateProject: updateProject(t),
      updateUser: updateUser(t),
    }
  },
})

export const schema = builder.toSchema()
