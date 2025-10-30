import type { UseQueryResult } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import type { InferResponseType } from "hono/client"
import { use } from "react"
import { Button } from "@/components/ui/button"
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

type Result = InferResponseType<typeof client.api.projects.$get>

type Props = {
  query: UseQueryResult<Result>
}

/**
 * ProjectsTable
 */
export function ProjectsTable(props: Props) {
  const data = use(props.query.promise)

  const projects = data ?? []

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Login</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="font-mono text-xs">
                {project.login}
              </TableCell>
              <TableCell>
                {new Date(project.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link to="/projects/$id" params={{ id: project.id }}>
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
