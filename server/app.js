import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import helmet from "helmet";
import mongoose from "./config/mongoose-config.js";
import userRouter from "./routes/userRouter.js"
const app = express();
dotenv.config();
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const startServer = async () => {
  try {
    // Routes
    app.use("/users", userRouter);


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
