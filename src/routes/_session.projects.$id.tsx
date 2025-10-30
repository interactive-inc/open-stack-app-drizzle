import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { ProjectDetail } from "@/components/pages/project-detail"
import { Card } from "@/components/ui/card"
import { client } from "@/lib/client"

export const Route = createFileRoute("/_session/projects/$id")({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { id } = Route.useParams()

  const projectQuery = useQuery({
    queryKey: ["project", id],
    async queryFn() {
      const response = await client.api.projects[":id"].$get({ param: { id } })
      return response.json()
    },
  })

  const membersQuery = useQuery({
    queryKey: ["project", id, "members"],
    async queryFn() {
      const response = await client.api.projects[":id"].members.$get({
        param: { id },
      })
      return response.json()
    },
  })

  const usersQuery = useQuery({
    queryKey: ["users"],
    async queryFn() {
      const response = await client.api.users.$get()
      return response.json()
    },
  })

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-10">
          <Card className="p-4">
            <div>Loading...</div>
          </Card>
        </div>
      }
    >
      <ProjectDetail
        projectId={id}
        projectQuery={projectQuery}
        membersQuery={membersQuery}
        usersQuery={usersQuery}
      />
    </Suspense>
  )
}
