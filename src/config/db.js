import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

        const connection = await mongoose.connect(process.env.MONGO_URL);

        console.log("Mongo DB connected:", connection.connection.host);
    } catch (error) {
        console.log("Mongo DB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDb;