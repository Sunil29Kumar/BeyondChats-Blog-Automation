import express from "express";
import cors from "cors";
import { connectDB } from "./database/db.js";

import scrapeBeyondChatsBlogs from "./routes/scrape.route.js";
import articleRoutes from "./routes/article.route.js";

await connectDB();

const app = express()
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000', "https://beyondchats.com/blogs"]
}))
app.use(express.json())

const PORT = 5000;


app.use("/api/scrape", scrapeBeyondChatsBlogs)
app.use("/api/articles", articleRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});