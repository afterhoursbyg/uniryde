import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getCurrentUser } from "./users.controller";

const router: Router = Router();

router.get("/me", authenticate, getCurrentUser);

export default router;
