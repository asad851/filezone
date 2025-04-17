import mongoose from "mongoose";
import config from "config";
import debug from "debug";
import dotenv from "dotenv";
const dbgr = debug("development:mongoose");
dotenv.config();
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

export default mongoose.connection;
