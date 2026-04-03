import detectScam from "../safety/scamDetector.js";

let chats = [];
let messages = [];

// CREATE CHAT
export const createChat = (req, res) => {
  const { inquiryId, studentId, ownerId } = req.body;

  const chat = {
    id: "chat_" + Date.now(),
    inquiryId,
    users: [studentId, ownerId],
    createdAt: new Date()
  };

  chats.push(chat);

  res.json(chat);
};

// SEND MESSAGE
export const sendMessage = (req, res) => {
  const { chatId, senderId, text } = req.body;

  const scamFlag = detectScam(text);

  const message = {
    id: Date.now().toString(),
    chatId,
    senderId,
    text,
    scamFlag,
    createdAt: new Date()
  };

  messages.push(message);

  res.json(message);
};

// GET MESSAGES
export const getMessages = (req, res) => {
  const { chatId } = req.params;

  const chatMessages = messages.filter(m => m.chatId === chatId);

  res.json(chatMessages);
};