import express from "express";

import {
    registerEmployee,
    loginEmployee,
    refreshAccessToken,
    logoutEmployee,
    getMe,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerEmployee);

router.post("/login", loginEmployee);

router.post("/refresh", refreshAccessToken);

router.post("/logout", authMiddleware, logoutEmployee);

router.get("/me", authMiddleware, getMe);

export default router;