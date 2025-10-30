import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { use } from "react"
import { LoginPage } from "@/components/pages/login-page"
import { Button } from "@/components/ui/button"
import { SessionContext } from "@/contexts/session-context"

export const Route = createFileRoute("/_session")({
  component: RouteComponent,
})

function RouteComponent() {
  const [session] = use(SessionContext)

  if (session === null) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-bold text-xl">
                App
              </Link>
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/projects">Projects</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/users">Users</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {session.email}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link to="/my/account">Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
