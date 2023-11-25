const express = require("express");
const Router = express.Router();
const roomChatController = require("../controllers/roomChatController");

Router.get("/add-users", roomChatController.addUserIntoRoom);
Router.get("/get-all", roomChatController.getAll);

module.exports = Router;
