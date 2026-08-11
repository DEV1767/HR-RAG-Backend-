import axios from "axios";

const ragClient = axios.create({
    baseURL: process.env.RAG_API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const askRag = async (question) => {
    try {
        const response = await ragClient.post("/api/chat", {
            question,
        });

        return response.data;

    } catch (error) {
        console.error(
            "RAG service error:",
            error.response?.data || error.message
        );

        if (error.code === "ECONNABORTED") {
            throw new Error("RAG service timeout");
        }

        if (error.response) {
            throw new Error("RAG service returned an error");
        }

        throw new Error("RAG service unavailable");
    }
};