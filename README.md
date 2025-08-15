# Todo List App (React + TypeScript + Vite + ASP.NET Core)

A full‑stack Todo application showcasing a clean React frontend integrated with a minimal ASP.NET Core Web API + SQLite persistence. Built intentionally in phases (localStorage → API) to highlight incremental architecture, testing, and layering.

**Live demo:** https://salmon-water-0cde51403.1.azurestaticapps.net/

+**Production API:** https://todo-app-bva2b7dha2f0fvbn.germanywestcentral-01.azurewebsites.net

## 1. Features

- ⚡ Optimistic, loader‑free task CRUD (React Query) with sequential mutation scoping
- Task model: title (10–200 chars), optional description, optional due date (today or future), status (`todo | done`)
- Client + server validation (zod + FluentValidation)
- Accessible UI primitives (keyboard navigable)
- Component & integration tests (Vitest + RTL + MSW)
- ASP.NET Core minimal API + EF Core (SQLite)
- Deployed (Azure Static Web Apps + Azure App Service)

## 2. Goals & Scope

### Goals

- Show pragmatic, testable React architecture (hooks + components)
- Demonstrate minimal clean ASP.NET Core API with validation

### Non‑Goals (for timeboxing)

- Authentication
- Full offline first experience

### Assumptions

- Single user
- SQLite acceptable for dev / demo; can swap provider easily

---

## 3. High-Level Architecture

```
Frontend (Vite + React 19)
  ├─ Components
  ├─ Hooks (React Query integrations)
  ├─ Services (API + local storage abstraction)
  └─ Types (shared task contracts)

Backend (ASP.NET Core Minimal API)
  ├─ Endpoints (/todos)
  ├─ EF Core DbContext (SQLite)
  ├─ FluentValidation validators
  └─ DTOs <-> Entity mapping

Persistence: SQLite (file Todos.db)
```

Data flow:

UI → Hook (`useQuery` / `useMutation`) → `task-service` → `api-service` (fetch wrapper) → API → EF Core → SQLite  
Validation occurs both client-side (zod) + server-side (FluentValidation).

---

## 4. Folder Structure

```
/src
  components/          UI + domain widgets
  hooks/               React Query wrappers (task queries/mutations)
  services/            API + localStorage abstractions
  types/               TypeScript task contracts
  pages/               Route-level components
  test/                Setup, utilities, msw mocks
/api
  TodoApi.cs           Endpoint mappings
  Todo.cs / DTOs.cs    Entity + transport models
  Validation/          FluentValidation validators
  TodoDb.cs            EF Core context
```

## 5. Data Model

### Task Fields

| Field       | Type                   | Notes                                    |
| ----------- | ---------------------- | ---------------------------------------- |
| id          | string                 | backend GUID                             |
| title       | string                 | Required (10–200 chars)                  |
| description | string?                | Optional                                 |
| status      | enum: `todo` \| `done` |
| dueDate     | ISO string             | Optional, must be in the future or today |
| createdAt   | ISO string             |                                          |
| updatedAt   | ISO string             |                                          |

### Optimistic UI

All task mutations apply instantly to the in-memory React Query cache (no spinners). A temporary UUID is assigned on create; once the server responds, the entry is reconciled with the persisted task. Mutations are scoped and executed sequentially to avoid race conditions; after the final pending mutation settles, a single refetch syncs canonical state. This improves perceived performance and keeps the interface snappy under latency.

---

## 6. API Reference

Base URL (Dev):  
`http://localhost:5208` (HTTP)  
`https://localhost:7071` (HTTPS)

| Method | Endpoint    | Description | Body (JSON)                                     |
| ------ | ----------- | ----------- | ----------------------------------------------- |
| GET    | /todos      | List all    | —                                               |
| GET    | /todos/{id} | Get one     | —                                               |
| POST   | /todos      | Create      | `{ title, description?, dueDate? }`             |
| PUT    | /todos/{id} | Full update | `{ id, title, description?, dueDate?, status }` |
| DELETE | /todos/{id} | Delete      | —                                               |

### Sample curl

```bash
# Create
curl -X POST http://localhost:5208/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Interview prep","description":"","dueDate":"2025-08-17T00:00:00"}'

# List
curl http://localhost:5208/todos

# Update
curl -X PUT http://localhost:5208/todos/3ceeb2bf-9ad9-418d-85f8-47bb432e5741 \
  -H "Content-Type: application/json" \
  -d '{"id":"3ceeb2bf-9ad9-418d-85f8-47bb432e5741","title":"Interview prep","description":"","status":"done","dueDate":"2025-08-17T00:00:00"}'

# Delete
curl -X DELETE http://localhost:5208/todos/3ceeb2bf-9ad9-418d-85f8-47bb432e5741
```

## 7. Environment & Configuration

Frontend `.env.local` (root):

```
VITE_API_BASE_URL=http://localhost:5208
```

Backend configuration (`appsettings.*.json`):

- Connection string (SQLite file path)
- Logging level
- Swagger enabled only in Development

## 8. Getting Started

### Prerequisites

- Node 20+
- pnpm 10+
- .NET SDK 9.0+

### Full Stack (two terminals)

```bash
# Terminal 1: backend
cd api
dotnet restore
dotnet watch run
```

```bash
# Terminal 2: frontend
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Open: http://localhost:5173

---

## 9. Testing Strategy

1. Component / Integration (Vitest + React Testing Library)
2. End‑to‑End (Playwright)

### 9.1 Component / Integration Tests (Vitest)

- Component tests (`src/**/*.test.tsx`) using Vitest + React Testing Library
- Network interactions mocked with MSW (`/src/test/mocks`)
- Utilities for rendering in `test/utils.ts`
- Focus: rendering correctness, mutation success

### 9.2 End‑to‑End (Playwright)

- Network: REAL backend + real SQLite persistence (no MSW mocks)
- Focus: Full user flows (add, edit, toggle, delete, persistence across reload)

---

## 10. Roadmap

- [x] Local-only MVP complete
- [x] Backend API
- [x] Frontend integration with API
- [x] Polish and deploy

## 11. Potential Improvements

1. Task ordering (drag & drop)
2. Backend integration tests
3. Authentication
4. Full offline first experience
