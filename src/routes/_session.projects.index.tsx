import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Suspense, use, useState } from "react"
import { ProjectsTable } from "@/components/pages/projects-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SessionContext } from "@/contexts/session-context"
import { client } from "@/lib/client"

export const Route = createFileRoute("/_session/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [session] = use(SessionContext)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  const query = useQuery({
    queryKey: [client.api.projects.$url(), session?.userId],
    async queryFn() {
      const response = await client.api.projects.$get()
      return response.json()
    },
  })

  const mutation = useMutation({
    async mutationFn(data: { name: string }) {
      if (!session) {
        throw new Error("Not authenticated")
      }

      const resp = await client.api.projects.$post({
        json: {
          userId: session.userId,
          name: data.name,
        },
      })

      if (!resp.ok) {
        const errorData = await resp.json()
        throw new Error(
          (errorData as { message?: string }).message ||
            "Failed to create project",
        )
      }

      return resp.json()
    },
    onSuccess() {
      setOpen(false)
      setName("")
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ name })
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your projects and teams
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mutation.isError && (
                <div className="rounded bg-destructive/15 px-4 py-3 text-destructive">
                  {mutation.error.message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Creating..." : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Suspense
        fallback={
          <Card className="p-4">
            <div className="text-center text-muted-foreground">Loading...</div>
          </Card>
        }
      >
        <ProjectsTable query={query} />
      </Suspense>
    </div>
  )
}
