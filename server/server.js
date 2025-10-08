import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./database.js";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Bus Tracking App Is Running");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
