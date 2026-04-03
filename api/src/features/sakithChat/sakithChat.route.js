import express from "express";
import {
  createChat,
  sendMessage,
  getMessages
} from "./sakithChat.controller.js";

const router = express.Router();

router.post("/create", createChat);
router.post("/send", sendMessage);
router.get("/:chatId", getMessages);

export default router;