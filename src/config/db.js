import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        console.log("Checking MONGO_URL...");
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing");
        }

        const connection = await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 10000
        });

        isConnected = connection.connection.readyState === 1;

        console.log("MongoDB CONNECTED");
        console.log("Host:", connection.connection.host);
        console.log("Database:", connection.connection.name);

    } catch (error) {
        isConnected = false;
        console.error("MongoDB CONNECTION FAILED");
        console.error(error);
        throw error;
    }
};

export default connectDb;