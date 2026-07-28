import "dotenv/config";
import { dbClient } from "@db/client.js";
import { taskTable, todoTable, userTable } from "@db/schema.js";
import cors from "cors";
import Debug from "debug";
import { eq, sql } from "drizzle-orm";
import type { ErrorRequestHandler } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
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

// Query todo items
app.get("/todo", async (req, res, next) => {
  try {
    // const results = await dbClient.query.todoTable.findMany();
    const results = await dbClient.query.todoTable.findMany({
      with: { tasks: true}
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Query users
app.get("/user", async (req, res, next) => {
  try {
    const email = req.body.email;
    const role = req.body.role;

    if (!email && !role) {
      const results = await dbClient.query.userTable.findMany();
      res.json(results);
    } else if (email && !role) {
      const results = await dbClient.query.userTable.findFirst({
        where: (userTable, {eq}) => eq(userTable.email, email),
      });
      res.json(results);
    } else if (!email && role) {
      const results = await dbClient
        .select()
        .from(userTable)
        .where(sql`${userTable.metadata}->>'role' = ${role}`);
      res.json(results);
    }
    
  } catch (err) {
    next(err);
  }
});


// Insert
app.put("/todo", async (req, res, next) => {
  try {
    const todoText = req.body.todoText ?? "";
    if (!todoText) throw new Error("Empty todoText");
    const result = await dbClient
      .insert(todoTable)
      .values({
        todoText,
      })
      .returning({ id: todoTable.id, todoText: todoTable.todoText });
    res.json({ msg: `Insert successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// Insert a task to a todo item
app.put("/todo/task", async (req, res, next) => {
  try {
    const taskText = req.body.taskText ?? "";
    const todoId = req.body.todoId;
    if (!taskText) throw new Error("Empty todoText");

    const result = await dbClient
      .insert(taskTable)
      .values({
        taskText,
        todoId
      })
      .returning({ id: taskTable.id, taskText: taskTable.taskText, todoId: taskTable.todoId });
    res.json({ msg: `Insert successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// Insert a user
app.put("/user", async (req, res, next) => {
  try {
    
    const email = req.body.email
    const displayName = req.body.displayName;
    const metadata = req.body.metadata;

    const result = await dbClient
      .insert(userTable)
      .values({
        email: email,
        displayName: displayName,
        metadata: metadata
      })
      .returning({ 
        id: userTable.id,
        email: userTable.email, 
        displayName: userTable.displayName,
        metadata: userTable.metadata
      });
    res.json({ msg: `Insert successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});


// Update
app.patch("/todo", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    const todoText = req.body.todoText ?? "";
    if (!todoText || !id) throw new Error("Empty todoText or id");

    // Check for existence if data
    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    const result = await dbClient
      .update(todoTable)
      .set({ todoText })
      .where(eq(todoTable.id, id))
      .returning({ id: todoTable.id, todoText: todoTable.todoText });
    res.json({ msg: `Update successfully`, data: result });
  } catch (err) {
    next(err);
  }
});

// Delete
app.delete("/todo", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    if (!id) throw new Error("Empty id");

    // Check for existence if data
    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    await dbClient.delete(todoTable).where(eq(todoTable.id, id));
    
    res.json({
      msg: `Delete successfully`,
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

app.post("/todo/all", async (req, res, next) => {
  try {
    await dbClient.delete(todoTable);
    res.json({
      msg: `Delete all todo items with sub tasks successfully`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

app.post("/user/all", async (req, res, next) => {
  try {
    await dbClient.delete(userTable);
    res.json({
      msg: `Delete all users successfully`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  debug(err.message);
  const errorResponse = {
    message: err.message || "Internal Server Error",
    type: err.name || "Error",
    stack: err.stack,
  };
  res.status(500).send(errorResponse);
};
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || 3000;
// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
