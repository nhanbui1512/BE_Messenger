const { UserModel, RoomChatModel } = require('../models');
const RoomChat = require('../models/roomChatModel');

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
    };

    if (!data.email || !data.userName || !data.phoneNumber || !data.password)
      return response
        .status(400)
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
}
module.exports = new UserController();
