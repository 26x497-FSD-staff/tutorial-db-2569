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

// use jsonErrorHandler middleware
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || 3000;
// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
