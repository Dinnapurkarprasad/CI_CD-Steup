import User from "../models/user.js";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bycrpt.genSalt();
    const hashPassword = await bycrpt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 1000,
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fileds are required" });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    let ismatched = await bycrpt.compare(password, user.password);

    if (!ismatched) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 1000,
    });

    res.status(200).json({
      data: {
        user: user.email,
        message: "User loged in successfully.",
      },
      tokens: {
        accesstoken: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

export async function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    expiresIn: new Date(0),
  });

  res.status(200).json({ message: "Loged out succssfully" });
}

export async function getUsers(req,res){
  
}