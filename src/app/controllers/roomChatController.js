const { UserModel, RoomChatModel } = require('../models');

class RoomChatController {
  async getAll(req, res, next) {
    try {
      const rooms = await RoomChatModel.findAll({
        include: {
          model: UserModel,
          through: { attributes: [] },
          attributes: {
            exclude: ['password'],
          },
        },
      });
      return res.status(200).json(rooms);
    } catch (error) {
      console.log(error);
      res.end();
    }
  }
  async addUserIntoRoom(req, res, next) {
    const userIds = req.body.user_ids;
    const roomId = req.query.room_id;

    try {
      const users = await UserModel.findAll({
        where: {
          userId: userIds,
        },
      });

      const room = await RoomChatModel.findByPk(roomId);
      if (room) {
        const result = await room.addUsers(users);
        if (!result) {
          return res.send('existed');
        }
        return res.send('join room successfully');
      } else {
        return res.status(400).json({ result: false, message: 'room not found' });
      }
    } catch (error) {
      console.log(error.message);
      return res.send('error');
    }
  }

  async createNewRoom(request, response, next) {
    const userId = request.userId;
    const othersUser = request.body.with_user_ids; // id những người khác mà người dùng muốn tạo phòng với họ
    const userIds = [userId, ...othersUser];

    if (!othersUser) return response.status(500).json({ result: false, message: 'invalid' });
    try {
      const users = await UserModel.findAll({
        where: {
          userId: userIds,
        },
      });

      const newRoom = await RoomChatModel.create({
        numberUser: users.length,
        idHostUser: userId,
      });

      await newRoom.addUsers(users);
      return response
        .status(200)
        .json({ result: true, message: 'create room and join users into successfully' });
    } catch (error) {
      console.log(error.message);
    }

    response.end();
  }

  async leaveRoom(request, response, next) {
    const userId = request.userId;
    const roomId = request.query.room_id;

    if (!roomId)
      return response.status(400).json({ result: false, message: 'room_id is not attached' });

    const user = await UserModel.findByPk(userId);
    if (!user) return response.status(400).json({ result: false, message: 'Not found user ' });

    const room = await RoomChatModel.findByPk(roomId);
    if (!room) return response.status(400).json({ result: false, message: 'Not found room' });

    await room.removeUser(user);
    return response.status(200).json({ result: true, message: 'Leave room successfully' });
  }
}
module.exports = new RoomChatController();
