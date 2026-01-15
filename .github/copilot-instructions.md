---
applyTo: "**/*"
---

# Overview

Full-stack application built on Cloudflare Workers with clean architecture principles. The backend implements Domain-Driven Design with layered architecture (Domain, Application, Infrastructure, Interface), while the frontend uses TanStack Router and React 19 with type-safe API integration via Hono RPC.

## Directory Structure

- `src/` - Main application source code
  - `api/` - Backend API with clean architecture
    - `domain/` - Business logic and domain models
      - `entities/` - Domain entities (Project, User, ProjectMember)
      - `values/` - Value objects (Name)
    - `application/` - Use cases and application services
      - `project/` - Project-related use cases (create, update, delete)
      - `user/` - User-related use cases
    - `infrastructure/` - External dependencies
      - `repositories/` - Data persistence implementations
      - `adapters/` - External service adapters
      - `types/` - Infrastructure type definitions
    - `interface/` - API endpoints and middleware
      - `routes/` - HTTP route handlers
      - `middlewares/` - Request/response middleware
      - `errors/` - Error classes
      - `factory.ts` - Hono factory with type context
  - `components/` - React components
    - `ui/` - shadcn/ui component library
    - `pages/` - Page-specific components
  - `contexts/` - React contexts (SessionContext)
  - `hooks/` - React hooks
  - `lib/` - Client utilities
    - `client.ts` - Hono RPC client
  - `routes/` - TanStack Router pages
  - `schema.ts` - Drizzle ORM schema definitions
  - `env.d.ts` - TypeScript environment types
- `drizzle/` - Database migrations
- `public/` - Static assets

## Technical Features

**Frontend**:
- TanStack Router for type-safe routing
- TanStack Start for SSR/SSG with Cloudflare Workers
- React 19 with TypeScript
- shadcn/ui component system
- Tailwind CSS v4 for styling
- Hono RPC client for type-safe API calls

**Backend**:
- Hono web framework
- Clean architecture with 4 layers
- Domain-Driven Design patterns
- Drizzle ORM with Cloudflare D1
- Zod for validation
- JWT authentication with signed cookies

**Infrastructure**:
- Cloudflare Workers for edge computing
- Cloudflare D1 for SQLite database
- Vite for build tooling
- Bun for package management and testing
- Biome for linting and formatting
- Wrangler for Cloudflare deployment

## Architecture Design

### Clean Architecture Layers

The backend follows clean architecture with strict separation of concerns across 4 layers:

**1. Domain Layer (`src/api/domain/`)** - Business Logic Core
- **Entities**: Core business objects with identity and lifecycle (e.g., `ProjectEntity`, `UserEntity`)
  - Immutable by design - methods return new instances
  - Self-contained business logic (e.g., `updateName()`, `delete()`)
  - Validated with Zod schemas
- **Value Objects**: Immutable objects defined by their values (e.g., `NameValue`)
  - No identity, compared by value equality
  - Encapsulate validation rules
- **No external dependencies** - Pure business logic only

**2. Application Layer (`src/api/application/`)** - Use Cases
- Orchestrates domain objects to fulfill use cases
- Examples: `CreateProject`, `UpdateProject`, `DeleteProject`
- Depends on: Domain entities, repositories (via interfaces)
- Returns: Domain entities or error objects
- Handles transaction boundaries and workflow logic

**3. Infrastructure Layer (`src/api/infrastructure/`)** - External Integration
- **Repositories**: Implement data persistence
  - Convert between domain entities and database records
  - Handle database operations (CRUD)
- **Adapters**: Integrate external services
- **Types**: Infrastructure-specific type definitions
- Depends on: Domain entities, Drizzle ORM, external APIs

**4. Interface Layer (`src/api/interface/`)** - HTTP API
- **Routes**: HTTP endpoint handlers
  - Validate requests with Zod
  - Instantiate and execute use cases
  - Transform results to HTTP responses
- **Middlewares**: Request/response processing
  - `databaseMiddleware`: Inject Drizzle client into context
  - `sessionMiddleware`: Parse JWT and inject session
- **Factory**: Hono factory with typed context (`HonoEnv`)
- **Errors**: HTTP error classes (`NotFoundError`, `InternalError`)

### Dependency Flow

```
Interface (Routes) → Application (Use Cases) → Domain (Entities)
                  ↘                          ↗
                   Infrastructure (Repositories)
```

**Key Principles**:
- Inner layers never depend on outer layers
- Domain layer has zero external dependencies
- Use cases coordinate but don't contain business logic
- Infrastructure implements domain contracts and depends on domain entities

## API Design

### Hono Web Framework

Type-safe API built with Hono and exported as RPC client:

**Server-side (`src/api/index.ts`)**:
```typescript
export const app = factory
  .createApp()
  .use(cors({ credentials: true, origin: (v) => v }))
  .use(contextStorage())
  .use(databaseMiddleware)
  .use(sessionMiddleware)
  .basePath("/api")
  .get("/projects", ...projects.GET)
  .post("/projects", ...projects.POST)
```

**Client-side (`src/lib/client.ts`)**:
```typescript
import { hc } from "hono/client"
import type { app } from "@/api"

export const client = hc<typeof app>(endpoint, {
  init: { credentials: "include", mode: "cors" },
})
```

### Route Handler Pattern

Each route exports HTTP method handlers using Hono factory:

```typescript
// src/api/interface/routes/projects.ts
import { factory } from "@/api/interface/factory"
import { zValidator } from "@hono/zod-validator"

export const GET = factory.createHandlers(async (c) => {
  const projects = await c.var.database.query.projects.findMany()
  return c.json(projects)
})

export const POST = factory.createHandlers(
  zValidator("json", z.object({ userId: z.string(), name: z.string() })),
  async (c) => {
    const json = c.req.valid("json")
    const useCase = new CreateProject(c)
    const result = await useCase.run({ userId: json.userId, name: json.name })
    
    if (result instanceof NotFoundError) {
      throw new HTTPException(404, { message: result.message })
    }
    
    return c.json(result)
  },
)
```

### Context and Environment

Hono context is typed with Cloudflare bindings and variables:

```typescript
// src/env.d.ts
export type HonoEnv = {
  Bindings: {
    DB: D1Database                    // Cloudflare D1
    JWT_COOKIE_SECRET: string
    JWT_SECRET: string
  }
  Variables: {
    database: DrizzleD1Database       // Drizzle client
    session: SessionPayload | null     // Authenticated user
  }
}
```

Access via context:
- `c.env.DB` - Cloudflare D1 database binding
- `c.var.database` - Drizzle ORM client (injected by middleware)
- `c.var.session` - Current user session (injected by middleware)

## Frontend Architecture

### TanStack Router

File-based routing with type-safe navigation:

```
src/routes/
  __root.tsx                 - Root layout
  _session.tsx              - Protected layout (requires auth)
  _session.index.tsx        - Dashboard
  _session.projects.index.tsx    - Projects list
  _session.projects.$id.tsx      - Project detail
  api.ts                    - API route handler
```

**Route Definition**:
```typescript
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_session/projects/")({
  component: ProjectsPage,
})
```

**Type-safe Navigation**:
```typescript
import { useNavigate } from "@tanstack/react-router"

const navigate = useNavigate()
navigate({ to: "/projects/$id", params: { id: "123" } })
```

### Session Management

Context-based authentication with JWT:

```typescript
// src/contexts/session-context.ts
export const SessionContext = createContext<Value>([null, async () => {}])

// Usage in components
const [session] = use(SessionContext)
if (session === null) {
  // Redirect to login
}
```

### Component Organization

- `src/components/ui/` - shadcn/ui base components (never modify directly)
- `src/components/pages/` - Page-specific components
- `src/components/*.tsx` - Shared application components

## Data Flow

### Database Access Pattern

**1. Schema Definition (`src/schema.ts`)**:
```typescript
export const drizzleProjects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})
```

**2. Repository (`src/api/infrastructure/repositories/project.repository.ts`)**:
```typescript
export class ProjectRepository {
  constructor(readonly c: Context) {}

  async write(entity: ProjectEntity) {
    await this.c.var.database.insert(drizzleProjects).values({
      id: entity.id,
      name: entity.name.value,
      // ...
    })
  }

  async read(id: string): Promise<ProjectEntity | null> {
    const data = await this.c.var.database.query.projects.findFirst({
      where: eq(drizzleProjects.id, id),
    })
    
    return new ProjectEntity({
      id: data.id,
      name: new NameValue(data.name),
      // ...
    })
  }
}
```

**3. Use Case (`src/api/application/project/create-project.ts`)**:
```typescript
export class CreateProject {
  constructor(
    readonly c: Context,
    readonly deps = {
      repository: new ProjectRepository(c),
    },
  ) {}

  async run(props: Props) {
    const project = new ProjectEntity({ /* ... */ })
    await this.deps.repository.write(project)
    return project
  }
}
```

**4. Route Handler (`src/api/interface/routes/projects.ts`)**:
```typescript
export const POST = factory.createHandlers(
  zValidator("json", schema),
  async (c) => {
    const json = c.req.valid("json")
    const useCase = new CreateProject(c)
    const result = await useCase.run(json)
    return c.json(result)
  },
)
```

### Frontend to Backend Flow

**1. Frontend Component**:
```typescript
const query = useQuery({
  queryKey: ["projects"],
  async queryFn() {
    const response = await client.api.projects.$get()
    return response.json()
  },
})
```

**2. Hono RPC Client** - Type-safe HTTP call to `/api/projects`

**3. Middleware Pipeline**:
- CORS validation
- Database client injection (`databaseMiddleware`)
- Session extraction (`sessionMiddleware`)

**4. Route Handler** - Validates request, executes use case

**5. Use Case** - Coordinates domain objects and repositories

**6. Domain Entity** - Executes business logic

**7. Repository** - Persists to Cloudflare D1

**8. Response** - JSON returned through middleware pipeline

## Cloudflare Integration

### Bindings Configuration

Configure in `wrangler.json`:
```json
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "open-stack-cloudflare",
    "database_id": "..."
  }],
  "vars": {
    "JWT_COOKIE_KEY": "open.stack.session"
  }
}
```

Access via `c.env.DB` in Hono handlers.

### Migrations

Create migration:
```bash
make create-migration
# or
bun drizzle-kit generate
```

Apply locally:
```bash
make apply-migration
# or
bun wrangler d1 migrations apply open-stack-cloudflare --local
```

Apply to production:
```bash
bun wrangler d1 migrations apply open-stack-cloudflare --remote
```

### Development vs Production

- **Development**: Uses local D1 database (`.wrangler/state/v3/d1/`)
- **Production**: Uses remote D1 database via `database_id`
- Add `"remote": true` to the D1 database binding in `wrangler.json` to connect to production database during development:

```json
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "open-stack-cloudflare",
    "database_id": "...",
    "remote": true
  }]
}
```

## System Independence

### Domain Independence
- Domain entities have zero external dependencies
- Pure TypeScript with Zod validation only
- Business logic is completely isolated and testable

### Infrastructure Abstraction
- Repositories abstract database access
- Domain layer doesn't know about Drizzle or D1
- Can swap implementations without affecting domain

### Framework Decoupling
- Hono is isolated to interface layer
- Domain and application layers are framework-agnostic
- Could migrate to different web framework without domain changes

### Type Safety Across Layers
- Hono provides end-to-end type safety (backend → RPC client → frontend)
- Drizzle provides type-safe database queries
- Zod validates runtime data at boundaries

## Core Location

**Backend Core**: `src/api/domain/` contains all business logic
- Entities define domain rules
- Value objects enforce invariants
- Zero dependencies on external systems

**Frontend Core**: `src/routes/` and `src/components/pages/` contain UI logic
- TanStack Router manages navigation
- React Query handles data synchronization
- Components compose shadcn/ui primitives

**Integration Point**: `src/lib/client.ts` provides type-safe RPC client
- Single source of truth for API contracts
- Type inference from backend to frontend
- Compile-time validation of API usage



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
