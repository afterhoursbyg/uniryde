import { Router } from "express";
import { login, logout, register } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

export default router;
