const { UserModel } = require("../models/index");

class UserController {
  async getAllUser(req, res, next) {
    const users = await UserModel.findAll();
    return res.status(200).json({ users: users });
  }
}
module.exports = new UserController();
