import { askRag } from "../services/rag.service.js";

export const chat = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        
        const cleanQuestion = question.trim();

        if (!cleanQuestion) {
            return res.status(400).json({
                success: false,
                message: "Question cannot be empty",
            });
        }

      
        const result = await askRag(cleanQuestion);

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("Chat controller error:", error.message);

        if (error.message === "RAG service timeout") {
            return res.status(504).json({
                success: false,
                message: "AI service timed out",
            });
        }

        if (error.message === "RAG service unavailable") {
            return res.status(503).json({
                success: false,
                message: "AI service is currently unavailable",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};