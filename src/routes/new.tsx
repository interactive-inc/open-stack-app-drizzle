import { createFileRoute } from "@tanstack/react-router"
import { NewAccountPage } from "@/components/pages/new-account-page"

export const Route = createFileRoute("/new")({
  component: Page,
})

function Page() {
  return <NewAccountPage />
}
