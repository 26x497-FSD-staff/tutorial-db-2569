import { Router, type Request, type Response } from "express";

import { dbClient } from "@db/client.js";
import { taskTable, todoTable } from "@db/schema.js";
import { eq } from "drizzle-orm";


const router = Router();

// GET /todo - Query todo items
router.get("/", async (req, res, next) => {
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

// PUT /todo - Insert a new todo item
router.put("/", async (req, res, next) => {
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

// PUT /todo/task - Insert a task to a specified todo item
router.put("/task", async (req, res, next) => {
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

// PATCH /todo - Update todo item
router.patch("/", async (req, res, next) => {
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

// DELETE /todo - Delete specified todo item
router.delete("/", async (req, res, next) => {
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

// POST /todo/reset - Delete all todo items
router.post("/reset", async (req, res, next) => {
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

export default router;