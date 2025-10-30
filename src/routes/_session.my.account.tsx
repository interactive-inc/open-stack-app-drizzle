import { createFileRoute } from "@tanstack/react-router"
import { use } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SessionContext } from "@/contexts/session-context"

export const Route = createFileRoute("/_session/my/account")({
  component: RouteComponent,
})

function RouteComponent() {
  const [session] = use(SessionContext)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-bold text-4xl tracking-tight">My Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Your current session details</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded bg-muted p-4">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
