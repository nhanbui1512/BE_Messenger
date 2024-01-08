const express = require('express');
const Router = express.Router();
const multer = require('multer');

const MessageController = require('../controllers/messageController');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/Public/Uploads/Images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

var upload = multer({ storage: storage });

Router.get('/get-by-room', MessageController.getMessagesInRoom);
Router.get('/find', MessageController.findMessageInRoom);

Router.post('/send-message', upload.array('photos', 12), MessageController.sendMessage);
Router.delete('/delete', MessageController.deleteMessage);

module.exports = Router;
