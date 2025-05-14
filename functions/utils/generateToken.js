import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretkey = process.env.JWT_SECRET;

export default function generateToken(data) {
  return jwt.sign(data, secretkey);
}
