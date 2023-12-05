const express = require('express');
const Router = express.Router();
const ReactionController = require('../controllers/reactionController');

Router.post('/create', ReactionController.createReaction);

module.exports = Router;
