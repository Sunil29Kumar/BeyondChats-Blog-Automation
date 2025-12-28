import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
            unique: true, // duplicate avoid karega
        },

        excerpt: {
            type: String,
        },

        author: {
            type: String,
        },

        source: {
            type: String,
            default: "BeyondChats",
        },

        version: {
            type: String,
            default: "original", // phase 2 ke liye useful
        },
    },
    { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
