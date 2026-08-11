import "dotenv/config"
import app from "./app.js"
import connectDb from "./src/config/db.js"

const PORT = process.env || 5000

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`Server is running on the PORT${PORT}`)
        })
    } catch (error) {
        console.log("Server startup failed", error.message);
        process.exit(1);
    }
}


startServer()
