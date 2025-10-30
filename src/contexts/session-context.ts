import type { InferResponseType } from "hono"
import { createContext } from "react"
import { client } from "@/lib/client"

const endpoint = client.api.auth.session

type Result = InferResponseType<typeof endpoint.$get>

type Value = [Result | null, () => Promise<void>]

export const SessionContext = createContext<Value>([null, async () => {}])
