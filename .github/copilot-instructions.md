---
applyTo: "**/*"
---

# Overview

Modern React application with TanStack Router and component library. Features routing, state management, and UI components with a documentation system powered by Model Context Protocol.

## Directory Structure

- `src/` - Main application source code
  - `components/` - React components
    - `ui/` - shadcn/ui component library (buttons, forms, dialogs, etc.)
  - `hooks/` - React hooks for state management
  - `lib/` - Core libraries and utilities
  - `routes/` - Page components and routes with TanStack Router
- `mcp/` - Model Context Protocol server
  - `tools/` - MCP tool implementations for documentation management
  - `utils/` - MCP utility functions
- `public/` - Static assets

## Technical Features

- TanStack Router for type-safe routing
- React 19 with TypeScript
- shadcn/ui component system
- Tailwind CSS v4 for styling
- Vite for build tooling
- Bun for package management and testing
- Biome for linting and formatting
- Model Context Protocol for documentation

## Data Fetching Pattern

### Query Promise Pattern with Suspense

Use React Suspense with `use(query.promise)` for data fetching components:

**Parent Component (Route)**:
```typescript
function ParentPage() {
  const query = useQuery({
    queryKey: ['data'],
    async queryFn() {
      const response = await client.api.data.$get()
      return response.json()
    },
  })

  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <DataTable query={query} />
      </Suspense>
    </div>
  )
}
```

**Child Component (Table/Display)**:
```typescript
import type { UseQueryResult } from "@tanstack/react-query"
import type { InferResponseType } from "hono/client"
import { use } from "react"

type Result = InferResponseType<typeof client.api.data.$get>

type Props = {
  query: UseQueryResult<Result>
}

export function DataTable(props: Props) {
  const data = use(props.query.promise)

  return (
    <Table>
      {/* Render data */}
    </Table>
  )
}
```

**Key Points**:
- Parent components manage `useQuery` and pass query object to children
- Child components use `use(props.query.promise)` to unwrap data
- Suspense handles loading states declaratively
- No need for `isLoading` or `isError` checks in child components
- Type safety with `InferResponseType` from Hono client

### Mutations

Use `refetch()` instead of `queryClient.invalidateQueries()` for simpler cache updates:

```typescript
const mutation = useMutation({
  async mutationFn(data) {
    const response = await client.api.data.$post({ json: data })
    return response.json()
  },
  async onSuccess() {
    await query.refetch()  // Directly refetch the query
  },
})
```
