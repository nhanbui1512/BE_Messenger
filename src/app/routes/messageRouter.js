const express = require('express');
const Router = express.Router();

const MessageController = require('../controllers/messageController');

Router.get('/get-by-room', MessageController.getMessagesInRoom);
Router.get('/find', MessageController.findMessageInRoom);

Router.post('/send-message', MessageController.sendMessage);
Router.delete('/delete', MessageController.deleteMessage);

module.exports = Router;
