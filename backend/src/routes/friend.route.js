import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests,
  searchUsers
} from "../controllers/friends.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Friend request routes
router.post("/request/:id", protectRoute, sendFriendRequest);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);
router.delete("/:id", protectRoute, removeFriend);

// Get friends and requests
router.get("/", protectRoute, getFriends);
router.get("/pending", protectRoute, getPendingRequests);
router.get("/search", protectRoute, searchUsers);

export default router;