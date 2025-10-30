import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FolderKanban, Users } from "lucide-react"
import { Suspense } from "react"
import { DebugView } from "@/components/debug-view"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { client } from "@/lib/client"

export const Route = createFileRoute("/_session/")({
  component: Home,
})

const endpoint = client.api.debug.random

function Home() {
  const query = useQuery({
    queryKey: [endpoint.$url()],
    async queryFn() {
      const resp = await endpoint.$get()
      return resp.json()
    },
  })

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-bold text-4xl tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your project management dashboard
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              {"Projects"}
            </CardTitle>
            <CardDescription>Manage your projects and teams</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/projects">View Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/users">View Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>System debug information</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <DebugView query={query} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
