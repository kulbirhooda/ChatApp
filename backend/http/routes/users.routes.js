import { Router } from "express";
import { getFriends, getMessages } from "../controllers/user.controller.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

// 🔐 PROTECTED ROUTES
router.get("/friends", requireAuth, getFriends);
router.get("/messages", requireAuth, getMessages);

export default router;
