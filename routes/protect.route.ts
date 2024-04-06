import Protected from "@controllers/protected.controller";
import express from "express";
import ensureAuthenticated from "../middleware/ensureAuthenticated";

const router = express.Router();

router.get("/api/v1/protect", ensureAuthenticated, Protected.protect);

export default router;
