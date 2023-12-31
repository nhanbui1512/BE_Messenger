const { UserModel, RoomChatModel } = require('../models');
const { Op } = require('sequelize');

class UserController {
  async getAllUser(req, res, next) {
    const users = await UserModel.findAll();
    return res.status(200).json({ users: users });
  }

  async registerAccount(request, response, next) {
    const data = {
      email: request.body.email,
      userName: request.body.userName,
      phoneNumber: request.body.phoneNumber,
      password: request.body.password,
      avatar: request.body.avatar || null,
    };

    if (!data.email || !data.userName || !data.phoneNumber || !data.password)
      return response
        .status(422)
        .json({ result: false, message: 'The data is not completely filled in' });

    try {
      const user = await UserModel.findOne({
        where: {
          email: data.email,
        },
      });

      if (user) {
        return response.status(400).json({ result: false, message: 'Email is existed' });
      } else {
        const newUser = await UserModel.create(data);
        return response
          .status(200)
          .json({ result: true, newUser, message: 'Register account successfully' });
      }
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async getUserInRoom(request, response, next) {
    const roomId = request.query.room_id;
    if (!roomId)
      return response.status(500).json({ result: false, message: 'room_id is not attached' });

    try {
      const room = await RoomChatModel.findByPk(roomId, {
        include: {
          model: UserModel,
          through: { attributes: [] },
          attributes: {
            exclude: ['password'],
          },
        },
      });

      if (!room) return response.status(200).json({ data: [] });
      return response.status(200).json({ data: room });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async getMyInfo(request, response, next) {
    const userid = request.userId;
    try {
      const user = await UserModel.findByPk(userid, {
        attributes: {
          exclude: ['password'],
        },
      });
      if (user !== null) return response.status(200).json({ data: user });
      return response.status(400).json({ isSuccess: false, message: 'not found user' });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async changePassword(req, response, next) {
    const userid = req.userId;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    if (!newPassword) return response.status(400).json({ message: 'newPassword must be attached' });
    if (!oldPassword) return response.status(400).json({ message: 'oldPassword must be attached' });

    try {
      const user = await UserModel.findOne({
        where: {
          userId: userid,
          password: oldPassword,
        },
      });

      if (user === null)
        return response.status(400).json({ isSuccess: false, message: 'Old password is wrong' });

      user.password = newPassword;

      const newData = await user.save();
      return response.status(200).json({ isSuccess: true, user: newData });
    } catch (error) {}
  }

  async findUser(req, response, next) {
    const valueSearch = req.query.search;
    if (!valueSearch)
      return response.status(400).json({ isSuccess: false, message: 'search must be attached' });

    try {
      const users = await UserModel.findAndCountAll({
        where: {
          [Op.or]: [
            { email: { [Op.like]: `%${valueSearch}%` } },
            {
              userName: {
                [Op.like]: `%${valueSearch}%`,
              },
            },
          ],
        },
      });

      return response.status(200).json({ isSuccess: true, total: users.count, data: users.rows });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ isSuccess: false, message: error.message });
    }
  }
}
module.exports = new UserController();
