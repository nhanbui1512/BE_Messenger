const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/getall', UserController.getAllUser);
router.get('/get-users', UserController.getUserInRoom);
router.get('/get-my-info', UserController.getMyInfo);
router.post('/register', UserController.registerAccount);
router.put('/change-password', UserController.changePassword);

module.exports = router;
