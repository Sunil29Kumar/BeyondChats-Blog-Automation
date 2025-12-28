import express from "express";
import { scrapeBeyondChatsBlogs } from "../controller/scrape.controller.js";

const router = express.Router();

// routes/scrape.routes.js
router.post("/beyondchats", scrapeBeyondChatsBlogs);


export default router;