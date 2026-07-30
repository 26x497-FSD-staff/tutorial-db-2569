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