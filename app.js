import express from "express";
import connectDb from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";

const app = express();

app.use(express.json());

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        res.status(500).json({ message: "Database connection failed" });
    }
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);

export default app;