import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HeadContent, Scripts } from "@tanstack/react-router"
import { Suspense } from "react"
import { LoadingPage } from "@/components/pages/loading-page"
import { SessionProvider } from "@/components/session-provider"

const queryClient = new QueryClient({
  defaultOptions: { queries: { experimental_prefetchInRender: true } },
})

type Props = { children: React.ReactNode }

export function ShellComponent(props: Props) {
  return (
    <html lang={"ja"}>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingPage />}>
            <SessionProvider>{props.children}</SessionProvider>
          </Suspense>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
