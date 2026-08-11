
import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("Checking MONGO_URL...");
        console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing");
        }

        const connection = await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB CONNECTED");
        console.log("Host:", connection.connection.host);
        console.log("Database:", connection.connection.name);

    } catch (error) {
        console.error("MongoDB CONNECTION FAILED");
        console.error(error);
        throw error;
    }
};

export default connectDb;