import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import productRoutes from "./routes/product.route.js";
import serviceRoutes from "./routes/service.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};


const port = process.env.PORT || 8800;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/product", productRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/appointment", appointmentRoutes);

//MIDDLEWARE
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
