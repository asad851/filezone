import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    const userExist = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExist) {
      return res.status(404).json({
        errorMessage: "Incorrect email or password",
      });
    } else {
      let correctPassword = bcrypt.compareSync(password, userExist.password);
      if (!correctPassword) {
        return res
          .status(401)
          .json({ errorMessage: "Incorrect email or password" });
      } else {
        let dataTojson = {
          id: userExist.id,
          name: userExist.name,
          email: userExist.email,
          avatar: userExist.avatar,
        };
        const token = generateToken(dataTojson);

        res
          .status(201)
          .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
          })
          .json({ errorMessage: null, response: { ...dataTojson, token } });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

export const registerController = async (req, res) => {
  try {
    let { name, email, password, avatar } = req.body;

    if (!password || !email || !name) {
      return res.status(400).json({ errorMessage: "Missing required fields" });
    }

    try {
    } catch (error) {
      return res.status(401).json({ errorMessage: "Invalid or expired token" });
    }
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          errorMessage: "A user with this email already exists.",
        });
      }

      let hashed = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          ...(avatar && { avatar }),
        },
      });

      const data = {
        name,
        email,
        avatar,
      };

      let token = generateToken(data);

      const response = { errorMessage: null, data };

      res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
        })
        .json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errorMessage: "Internal server error!" });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: "Internal server error!" });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "None",
        secure: false,
        path: "/",
      })
      .json("user successfully logged out");
  } catch (err) {
    res.status(500).json({ errorMessage: "Internal server error!" });
  }
};
