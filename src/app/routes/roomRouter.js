const express = require('express');
const Router = express.Router();
const roomChatController = require('../controllers/roomChatController');

Router.post('/add-users', roomChatController.addUserIntoRoom);
Router.get('/get-all', roomChatController.getAll);
Router.post('/create', roomChatController.createNewRoom);
Router.put('/leave', roomChatController.leaveRoom);
module.exports = Router;
