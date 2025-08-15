### Todo List App (React + TypeScript + Vite + ASP.NET Core)

A Todo app built in phases: start with a local-only React frontend, then add a C# ASP.NET Core API with SQL.

### Features

- **Tasks**: title, description, status, due date
- **CRUD**: create, edit, delete, list
- **Storage**: localStorage (MVP); API + SQL

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: ASP.NET Core Web API, EF Core

### Getting Started (Frontend)

Prerequisites:

- Node 20+
- pnpm 10+

Install and run:

```bash
pnpm install
pnpm dev
```

Useful scripts:

```bash
pnpm test           # run tests
pnpm build          # typecheck + build
pnpm preview        # preview production build
```

### Getting Started (Backend)

Prerequisites:

- .NET SDK 9.0+
- (Optional) SQLite CLI if you want to inspect the DB (`Todos.db`)

Backend folder: `api/`

Key files:

- `Program.cs` – entry point (top-level statements)
- `TodoApi.cs` – minimal API endpoint mappings (mounted at `/todos`)
- `Todo.cs` / `DTOs.cs` – entity & data transfer objects
- `TodoDb.cs` – EF Core `DbContext` (SQLite)
- `Validation/` – FluentValidation validators
- `appsettings*.json` – configuration

Run locally:

```bash
cd api
dotnet restore
dotnet run
```

Default dev URLs (from `launchSettings.json`):

- HTTP: http://localhost:5208
- HTTPS: https://localhost:7071

Swagger (Development only):

- https://localhost:7071/swagger

Core endpoints:

- GET `/todos` – list all
- GET `/todos/{id}` – get one
- POST `/todos` – create
- PUT `/todos/{id}` – update
- DELETE `/todos/{id}` – delete

Hot reload during development:

```bash
dotnet watch run
```

Build / publish:

```bash
dotnet publish -c Release -o out
dotnet out/TodoApi.dll
```

Front-end integration:
Create `.env.local` file at repo root:

```bash
VITE_API_BASE_URL=https://localhost:7071
```

Then run the frontend in another terminal: `pnpm dev`.

### Roadmap

- [x] Local-only MVP complete
- [x] Backend API
- [x] Frontend integration with API
- [ ] Polish and deploy
