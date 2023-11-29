const express = require('express');
const Router = express.Router();

const reactController = require('../controllers/emotionController');

Router.get('/get-all', reactController.getAllEmotion);

module.exports = Router;
