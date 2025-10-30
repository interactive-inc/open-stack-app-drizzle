import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Suspense, useState } from "react"
import { UsersTable } from "@/components/pages/users-table"
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
import { client } from "@/lib/client"

export const Route = createFileRoute("/_session/users/")({
  component: UsersPage,
})

const endpoint = client.api.users

function UsersPage() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const query = useQuery({
    queryKey: [endpoint.$url()],
    async queryFn() {
      const response = await endpoint.$get()
      return response.json()
    },
  })

  const mutation = useMutation({
    async mutationFn(data: { email: string; password: string }) {
      const response = await client.api.users.$post({ json: data })
      if (!response.ok) {
        const error = await response.json()
        const errorMessage =
          (error as { message?: string }).message ||
          `Failed to create user (${response.status})`
        throw new Error(errorMessage)
      }
      return response.json()
    },
    async onSuccess() {
      await query.refetch()
      setOpen(false)
      setEmail("")
      setPassword("")
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">Users</h1>
          <p className="mt-2 text-muted-foreground">Manage user accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mutation.isError && (
                <div className="rounded bg-destructive/15 px-4 py-3 text-destructive">
                  {mutation.error.message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-muted-foreground text-sm">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Creating..." : "Create User"}
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
        <UsersTable query={query} />
      </Suspense>
    </div>
  )
}
