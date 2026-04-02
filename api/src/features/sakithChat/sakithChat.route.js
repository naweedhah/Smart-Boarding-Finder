const router = require("express").Router();
const {
  createChat,
  sendMessage,
  getMessages
} = require("./sakithChat.controller");

router.post("/create", createChat);
router.post("/send", sendMessage);
router.get("/:chatId", getMessages);

module.exports = router;