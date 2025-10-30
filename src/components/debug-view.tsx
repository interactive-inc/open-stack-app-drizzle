import type { UseQueryResult } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"
import { use } from "react"
import { Card } from "@/components/ui/card"
import type { client } from "@/lib/client"

type Result = InferResponseType<typeof client.api.debug.random.$get>

type Props = {
  query: UseQueryResult<Result, Error>
}

export function DebugView(props: Props) {
  const result = use(props.query.promise)

  return <Card className="p-4">Random Value: {result.value}</Card>
}
