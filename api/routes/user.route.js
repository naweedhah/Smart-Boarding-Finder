import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
  getNotifications,
  markNotificationRead,
  getRoommateProfile,
  upsertRoommateProfile,
  getRoommateMatches,
} from "../controllers/user.controller.js";
import {verifyToken} from "../src/shared/middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
// router.get("/search/:id", verifyToken, getUser);
router.get("/notification", verifyToken, getNotificationNumber);
router.get("/notifications", verifyToken, getNotifications);
router.put("/notifications/:id/read", verifyToken, markNotificationRead);
router.get("/roommate-profile", verifyToken, getRoommateProfile);
router.put("/roommate-profile", verifyToken, upsertRoommateProfile);
router.get("/roommate-matches", verifyToken, getRoommateMatches);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
