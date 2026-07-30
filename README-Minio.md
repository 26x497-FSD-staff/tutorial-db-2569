# File Storage Tutorial

This is a `File Storage Tutorial` for the `Backend Architecture` module.
We will continue from the []() project.

---

## Content

- Project reviewing 
- Project restructuring
- Using file system as file storage
- Using Object storage as file storage

---

## Project Setup

Clone the []() project.

```bash
pnpm install
pnpm approve-builds
```

This tutorial also requires a `PostgreSQL` database. We can use the [pf-db](https://github.com/fullstack-69/pf-db.git) project.

---

## Project Reviewing

- Folders:
  - `./src` contains `index.ts` which defines all API endpoints.
  - `./db` stores database schemas, encryption logic, and other database utilities.
- API Endpoints:
  - `/todo` endpoints handle CRUD operations on `todo` items and their `task`.
  - `/user` endpoints handle CRUD operations on `user` data.

---

## Project Restructuring

We will create the following folders and restructure API endpoint codes

- `./src/routes` stores logic for all endpoints.
  - `todoRouter.ts` contains codes of all `/todo/...` 
  - `userRouter.ts` contains codes for all `/user/...`
- `./src/middlewares` stores logic for all middlewares.
  - `jsonErrorHandler.ts` contains codes of the `jsonError` middleware

After restructuring the code, `./src/index.ts` is left with the following code.

```typescript
import "dotenv/config";

// import middlewares
import cors from "cors";
import Debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { jsonErrorHandler } from "./middlewares/jsonErrorHandler.ts";

// import routers
import todoRouter from "./routes/todoRouter.ts";
import userRouter from "./routes/userRouter.ts";

import { todo } from "node:test";
const debug = Debug("pf-backend");

//Intializing the express app
const app = express();

//Middleware
app.use(morgan("dev", { immediate: false }));
app.use(helmet());
app.use(
  cors({
    origin: false, // Disable CORS
    // origin: "*", // Allow all origins
  }),
);
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

// use routers
app.use('/todo',todoRouter);
app.use('/user',userRouter);
app.use('/file',fileRouter_v1);
app.use('/v2/file',fileRouter_v2);

// use jsonErrorHandler middleware
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || 3000;
// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
```
---

## Using File System as file storage

---

## Using Object Storage as file storage

---

## Minio Client (MC)

```bash
mc alias set localminio http://localhost:9000 minioadmin minio1234
Added `localminio` successfully.

mc alias ls
localminio
  URL       : http://localhost:9000
  AccessKey : minioadmin
  SecretKey : minio1234
  API       : s3v4
  Path      : auto
  Src       : /tmp/.mc/config.json

mc admin accesskey create localminio --name todoapp minioadmin
Access Key: 1S7G2CJKLL6P1VG2PCZZ
Secret Key: fjsWuXDAoisfqU8vfZvoh4zFXnrHMtrjtRBQR7XE
Expiration: NONE
Name: todoapp
Description:

mc admin accesskey ls localminio
User: minioadmin
  Access Keys:
    387VS91F9BIIPFVEDCG6, expires: never, sts: false
    XDYKSU1YGXWLU9JAZM1G, expires: never, sts: false

mc mb localminio/todo-app
Bucket created successfully `localminio/todo-app`.

mc ls localminio
[2026-07-29 07:30:58 UTC]     0B todo-bucket/
```