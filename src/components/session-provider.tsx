import { useSuspenseQuery as useQuery } from "@tanstack/react-query"
import { SessionContext } from "@/contexts/session-context"
import { client } from "@/lib/client"

const endpoint = client.api.auth.session

type Props = {
  children: React.ReactNode
}

export function SessionProvider(props: Props) {
  const query = useQuery({
    queryKey: [endpoint.$url()],
    async queryFn() {
      const resp = await client.api.auth.session.$get()
      return resp.json()
    },
  })

  const refresh = async () => {
    query.refetch()
  }

  return (
    <SessionContext.Provider value={[query.data, refresh]}>
      {props.children}
    </SessionContext.Provider>
  )
}
