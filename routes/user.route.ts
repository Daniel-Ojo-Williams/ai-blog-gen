import UserController from "@controllers/auth.controller";
import express from "express";
import { validate } from "../middleware/validate";
import { loginSchema, signupSchema } from "../schema/schema";

const router = express.Router();

router.post("/api/v1/signup", validate(signupSchema), UserController.registerUser);
router.post("/api/v1/login", validate(loginSchema), UserController.loginUser);


export default router;