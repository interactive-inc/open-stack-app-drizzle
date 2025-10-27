import { env } from "cloudflare:workers"
import { createFileRoute } from "@tanstack/react-router"
import { app } from "@/api"

export const Route = createFileRoute("/api")({
  server: {
    handlers: {
      GET(props) {
        return app.fetch(props.request, env)
      },
      POST(props) {
        return app.fetch(props.request, env)
      },
      DELETE(props) {
        return app.fetch(props.request, env)
      },
      PUT(props) {
        return app.fetch(props.request, env)
      },
    },
  },
})
