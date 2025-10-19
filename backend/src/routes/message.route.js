import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, searchUsers, sendMessage, markAsRead } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/users/search", protectRoute, searchUsers);
router.get("/:id", protectRoute, getMessages);
router.put("/read/:friendId", protectRoute, markAsRead);

router.post("/send/:id", protectRoute, sendMessage);

export default router;