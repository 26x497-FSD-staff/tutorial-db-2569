import { Router, type Request, type Response } from "express";

import { dbClient } from "@db/client.js";
import { userTable } from "@db/schema.js";
import { sql } from "drizzle-orm";

const router = Router();

// GET /user - Get users by email or role
router.get("/", async (req, res, next) => {
  try {
    const email = req.body ? null : req.body.email;
    const role = req.body ? null : req.body.role;

    if (!email && !role) {
      const results = await dbClient.query.userTable.findMany();
      res.json(results);
    } else if (email && !role) {
      const results = await dbClient.query.userTable.findFirst({
        where: (userTable, {eq}) => eq(userTable.email, email),
      });
      res.json(results);
    } else if (!email && role) {
      // This will throw error when the metadata is encrypted
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

// PUT /user - Create a new user
router.put("/", async (req, res, next) => {
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

// POST /user/reset - Delete all users
router.post("/reset", async (req, res, next) => {
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

export default router;