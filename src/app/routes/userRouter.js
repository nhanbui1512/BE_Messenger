const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const userController = require('../controllers/userController');

router.get('/getall', UserController.getAllUser);
router.get('/get-users', UserController.getUserInRoom);
router.get('/get-my-info', UserController.getMyInfo);
router.get('/search', userController.searchUser);

router.post('/register', UserController.registerAccount);
router.put('/change-password', UserController.changePassword);

module.exports = router;
