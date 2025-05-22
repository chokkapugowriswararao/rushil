import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true })); 

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",   
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],  // Ensure all necessary methods are included
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-File-Name', 'X-File-Size'], // Include any headers related to file uploads
    credentials: true,  // Allow credentials (cookies, authorization headers)
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port:" + PORT);
    connectDB();
});
