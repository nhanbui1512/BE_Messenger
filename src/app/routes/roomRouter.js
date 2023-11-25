const express = require("express");
const Router = express.Router();
const RoomChatController = require("../controllers/roomChatController");
const roomChatController = require("../controllers/roomChatController");

Router.get("/add-users", roomChatController.addUserIntoRoom);

module.exports = Router;
