import type { UseQueryResult } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"
import { use } from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { client } from "@/lib/client"

type Result = InferResponseType<typeof client.api.users.$get>

type Props = {
  query: UseQueryResult<Result>
}

/**
 * UsersTable
 */
export function UsersTable(props: Props) {
  const data = use(props.query.promise)

  const users = data ?? []

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Login</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-xs">{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.login}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
