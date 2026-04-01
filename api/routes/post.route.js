import express from "express";
import {verifyToken} from "../src/shared/middleware/verifyToken.js";
import {
  addPost,
  createBookingRequest,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/:id/book", verifyToken, createBookingRequest);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
