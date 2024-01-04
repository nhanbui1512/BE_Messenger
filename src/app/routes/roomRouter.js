const express = require('express');
const Router = express.Router();
const roomChatController = require('../controllers/roomChatController');

Router.get('/get-all', roomChatController.getAll);
Router.get('/get-room', roomChatController.getRoomOfUser);

Router.post('/create', roomChatController.createNewRoom);
Router.post('/add-users', roomChatController.addUserIntoRoom);
Router.put('/leave', roomChatController.leaveRoom);

Router.delete('/kick', roomChatController.kickMember);
module.exports = Router;
