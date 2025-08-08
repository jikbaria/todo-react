### Todo List App (React + TypeScript + Vite + ASP.NET Core)

A Todo app built in phases: start with a local-only React frontend, then add a C# ASP.NET Core API with SQL and auth.

### Features

- **Tasks**: title, description, status, due date
- **CRUD**: create, edit, delete, list
- **Storage**: localStorage (MVP); API + SQL + auth (planned)

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend (planned)**: ASP.NET Core Web API, EF Core, Identity (JWT)

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

### Roadmap

- [ ] Local-only MVP complete
- [ ] Backend API with auth
- [ ] Frontend integration with API
- [ ] Polish and deploy
