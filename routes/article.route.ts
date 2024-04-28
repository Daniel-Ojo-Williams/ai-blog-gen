import ArticleClass from "@controllers/article.controller";
import express from "express";
import ensureAuthenticated from "../middleware/ensureAuthenticated";
import { validate } from "../middleware/validate";
import { generateArticle, updateArticle } from "../schema/schema"

const router = express.Router();

router.post("/api/v1/article", ensureAuthenticated, validate(generateArticle), ArticleClass.createArticle);
router.get("/api/v1/article/user", ensureAuthenticated, ArticleClass.getAllUserArticles);
router.get("/api/v1/article/:article_id", ensureAuthenticated, ArticleClass.getArticleById);
router.patch("/api/v1/article/:article_id", ensureAuthenticated, validate(updateArticle), ArticleClass.updateArticle);
router.delete("/api/v1/article/:article_id", ensureAuthenticated, ArticleClass.deleteArticle);

export default router;
