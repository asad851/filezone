import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import helmet from "helmet";
import mongoose from "./config/mongoose-config.js";
import userRouter from "./routes/userRouter.js";
import segmentRouter from "./routes/segmentRoutes.js";
const app = express();
dotenv.config();

const url = process.env.FE_URL;
app.use(helmet());
app.use(
  cors({
    origin: url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});
const startServer = async () => {
  try {
    // Routes
    app.use("/users", userRouter);
    app.use("/segment", segmentRouter);

    const PORT = process.env.PORT || 5022;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during server initialization:", error);
  }
};

startServer();
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
