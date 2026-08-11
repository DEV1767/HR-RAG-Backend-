import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);

export default app;