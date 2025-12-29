
import express from "express";
import { enhanceArticle } from "../controller/enhanceArticle.controller.js";

const router = express.Router();

router.post("/", enhanceArticle);

export default router;