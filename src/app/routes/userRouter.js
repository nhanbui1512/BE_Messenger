const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/getall", UserController.getAllUser);

module.exports = router;
