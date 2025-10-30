import { type UseQueryResult, useMutation } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"
import { Trash2, UserPlus } from "lucide-react"
import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { client } from "@/lib/client"

const $getProject = client.api.projects[":id"].$get
const $getProjectMembers = client.api.projects[":id"].members.$get
const $getUsers = client.api.users.$get

type ProjectResult = InferResponseType<typeof $getProject>
type MembersResult = InferResponseType<typeof $getProjectMembers>
type UsersResult = InferResponseType<typeof $getUsers>

type Props = {
  projectId: string
  projectQuery: UseQueryResult<ProjectResult>
  membersQuery: UseQueryResult<MembersResult>
  usersQuery: UseQueryResult<UsersResult>
}

export function ProjectDetail(props: Props) {
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<"OWNER" | "ADMIN" | "MEMBER" | "VIEWER">(
    "MEMBER",
  )

  const project = use(props.projectQuery.promise)
  const members = use(props.membersQuery.promise)
  const users = use(props.usersQuery.promise)

  const addMemberMutation = useMutation({
    async mutationFn(data: {
      userId: string
      role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
    }) {
      const response = await client.api.projects[":id"].members.$post({
        param: { id: props.projectId },
        json: data,
      })

      if (!response.ok) {
        throw new Error("Failed to add member")
      }

      return response.json()
    },
    async onSuccess() {
      await props.membersQuery.refetch()
    },
  })

  const removeMemberMutation = useMutation({
    async mutationFn(data: { userId: string }) {
      const response = await client.api.projects[":id"].members[
        ":userId"
      ].$delete({
        param: { id: props.projectId, userId: data.userId },
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      return response.json()
    },
    async onSuccess() {
      await props.membersQuery.refetch()
    },
  })

  function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    addMemberMutation.mutate({ userId, role })
    setOpen(false)
    setUserId("")
    setRole("MEMBER")
  }

  function handleRemoveMember(memberUserId: string) {
    if (!confirm("Are you sure you want to remove this member?")) {
      return
    }
    removeMemberMutation.mutate({ userId: memberUserId })
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-bold text-4xl tracking-tight">{project.name}</h1>
        <p className="mt-2 text-muted-foreground">Project ID: {project.id}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Members</CardTitle>
              <CardDescription>
                Manage who has access to this project
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Project Member</DialogTitle>
                  <DialogDescription>
                    Add a user to this project with a specific role
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">User</Label>
                    <Select value={userId} onValueChange={setUserId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter(
                            (user) =>
                              !members.some((m) => m.userId === user.id),
                          )
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.email} ({user.login})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={role}
                      onValueChange={(v) => setRole(v as typeof role)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OWNER">Owner</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={addMemberMutation.isPending}>
                    {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {member.user.login}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ring-1 ring-gray-500/10 ring-inset">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.userId)}
                      disabled={removeMemberMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
