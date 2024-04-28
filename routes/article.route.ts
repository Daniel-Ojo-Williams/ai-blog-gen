import ArticleClass from "@controllers/article.controller";
import express from "express";
import ensureAuthenticated from "../middleware/ensureAuthenticated";

const router = express.Router();

router.get("/api/v1/article", ensureAuthenticated, ArticleClass.createArticle);

export default router;
