const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/getall', UserController.getAllUser);
router.get('/get-users', UserController.getUserInRoom);
router.post('/register', UserController.registerAccount);

module.exports = router;
