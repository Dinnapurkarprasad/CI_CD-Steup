import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("hey from server");
});

app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
