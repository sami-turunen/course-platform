import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";

dotenv.config(); // Bring in env variables

const app = express(); // Create an express app
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // For parsing JSON

app.use("/api/auth", authRoutes); // Bring in auth routes
app.use("/api/courses", courseRoutes); // Bring in course routes

// Try connecting to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB")) // Success
  .catch((error) => console.log(error)); // Failure

const PORT = process.env.PORT || 3001; // Port to listen on
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server
