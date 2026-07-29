# Object Storage Tutorial

This is a `Object Storage Tutorial` guideline for the `Backend Architecture` module.
We will continue from the []() project.

---

## Project Setup

Clone the []() project.

```bash
pnpm install
pnpm approve-builds
```

This tutorial also requires a `PostgreSQL` database. We can use the [pf-db](https://github.com/fullstack-69/pf-db.git) project.

---

## Project Review

- `/todo` endpoints handle CRUD operations on `todo` items and their `task`.
- `/user` endpoints handle CRUD operations on `user` data.
- Reorganizes project structure:
  - `./src/routes` stores logic for different endpoints (in different files).
  - `./src/middlewares` stores logic for different middlewares.
  - `./db` stores database schemas, encryption logic, and other database utilities.