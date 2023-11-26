const token_require = require('../until/token');
const { UserModel } = require('../models');

require('dotenv').config();

class LoginController {
  //GET all sales post
  async checkLogin(req, response) {
    const email = req.body.email;
    const password = req.body.password;

    try {
      var user = await UserModel.findOne({
        where: {
          email: email,
          password: password,
        },
      });

      if (user === null) {
        return response.status(200).json({ result: false, message: 'email or password is wrong' });
      } else {
        user = user.toJSON();
        const token = token_require.GenerateAccpectToken(user);
        return response.status(200).json({ result: true, token: token });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: error.message });
    }
  }
}
module.exports = new LoginController();
