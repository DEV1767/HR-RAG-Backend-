import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB connected")
    } catch (error) {
        console.log("Mongo DB  connection failed", error.message)
        process.exit(1);
    }
}

export default connectDb