
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://sunil:sunil@cluster0.hc0phqq.mongodb.net/Beyondchats`);
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