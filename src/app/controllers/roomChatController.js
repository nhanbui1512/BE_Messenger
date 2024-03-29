const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const { UserModel, RoomChatModel, UserRoomchatModel, MessageModel } = require('../models');

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
        return res.status(200).json({
          isSuccess: true,
          message: 'Add user into room successfully',
        });
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

  async getRoomOfUser(request, response, next) {
    const userId = request.userId;
    try {
      //  ket qua truy van
      let res = await UserModel.findOne({
        where: {
          userId: userId,
        },
        include: {
          model: RoomChatModel,
          through: { attributes: [] },
          include: [
            {
              model: MessageModel,
              limit: 1,
              order: [['createAt', 'DESC']],
              attributes: {
                exclude: ['roomchatRoomId'],
              },
              include: {
                model: UserModel,
                attributes: {
                  exclude: ['password', 'createAt', 'updateAt'],
                },
              },
            },
            {
              model: UserModel,
              attributes: {
                exclude: ['password'],
              },
              through: { attributes: [] },
            },
          ],
        },
      });

      // convert sang JSON de xu ly ten phong
      res = res.toJSON();
      const rooms = res.roomchats;

      rooms.map((room) => {
        // neu phong chat chi co 2 nguoi thi tra ve avatar cua nguoi kia
        if (room.users.length === 2) {
          let avatarRoom = room.users.find((user) => {
            return user.userId !== userId;
          }).avatar;
          room.avatar = avatarRoom;
        }

        if (room.users.length === 2) {
          let roomName = room.users.find((user) => {
            return user.userId !== userId;
          }).userName;
          room.roomName = roomName;
        }

        if (room.messages[0] && room.messages[0].userUserId === userId)
          room.messages[0].user.userName = 'Bạn';
      });

      return response.status(200).json({ data: res.roomchats });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async kickMember(req, response, next) {
    const memberId = req.query.member_id;
    const userId = req.userId;
    const roomId = req.query.room_id;

    const errors = [];

    if (!memberId) throw new ValidationError({ member_id: 'member_id must be attached' });
    if (!roomId) throw new ValidationError({ room_id: 'room_id must be attached' });

    if (isNaN(Number(memberId))) errors.push({ member_id: 'member_id must be type of Integer' });
    if (isNaN(Number(roomId))) errors.push({ room_id: 'room_id must be type of Integer' });

    if (errors.length > 0) throw new ValidationError(errors);
    const isInRoom = await UserRoomchatModel.findOne({
      where: {
        userUserId: userId,
        roomchatRoomId: roomId,
      },
    });

    if (isInRoom === null)
      throw new NotFoundError({
        user: 'User is not in this room',
      });

    const member = await UserRoomchatModel.findOne({
      where: {
        roomchatRoomId: roomId,
        userUserId: memberId,
      },
    });

    if (member === null) throw new NotFoundError({ member: 'Member is not found in this room' });
    else {
      member.leaveAt = new Date();
      member.deleteBy = userId;
      await member.save();
    }

    return response.status(200).json({
      isSuccess: true,
      message: 'kick user successfully',
    });
  }
}

module.exports = new RoomChatController();
