const express = require('express');
const Router = express.Router();
const ReactionController = require('../controllers/reactionController');

Router.post('/create', ReactionController.createReaction);
Router.delete('/delete', ReactionController.deleteReaction);

module.exports = Router;
