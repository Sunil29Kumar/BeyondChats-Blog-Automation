
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
};


process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("Database Disconnected!");
    process.exit(0);
});