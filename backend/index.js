import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import path from "path";
dotenv.config();
const __dirname = path.resolve();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.URL,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/notification", notificationRoute);
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT} 🚀`);
});
