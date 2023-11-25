const express = require("express");
const Router = express.Router();

const MessageController = require("../controllers/messageController");

Router.post("/send-message", MessageController.sendMessage);
Router.get("/get-by-room", MessageController.getMessagesInRoom);
module.exports = Router;
