import express from "express";
import {
  addMessage
} from "./message.controller.js";
import {verifyToken} from "../../shared/middleware/verifyToken.js";

const router = express.Router();


router.post("/:chatId", verifyToken, addMessage);

export default router;
