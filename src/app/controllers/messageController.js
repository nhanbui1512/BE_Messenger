const ValidationError = require('../errors/ValidationError');

const {
  MessageModel,
  RoomChatModel,
  UserRoomchatModel,
  UserModel,
  MessageGroupModel,
  ReactionModel,
  EmotionModel,
} = require('../models');
const { reactionFormater } = require('../until/reaction');
const NotFoundError = require('../errors/NotFoundError');
const { Op } = require('sequelize');

class MessageController {
  async sendMessage(request, response, next) {
    const content = request.body.content;
    const roomId = request.body.roomId;
    const userId = request.userId;

    if (!roomId || !content)
      return response.status(400).json({
        result: false,
        message: 'information is not completely filled',
      });

    try {
      const room = await RoomChatModel.findByPk(roomId, {
        include: {
          model: MessageGroupModel,
          limit: 1,
          order: [['createAt', 'DESC']],
          include: {
            model: MessageModel,
            attributes: {
              exclude: ['messagegroupId', 'roomchatRoomId', 'userUserId'],
            },
          },
        },
      });
      if (!room)
        return response.status(400).json({
          result: false,
          message: 'Not found room',
        });

      const userInRoom = await UserRoomchatModel.findOne({
        where: {
          roomchatRoomId: roomId,
          userUserId: userId,
        },
      });

      if (!userInRoom)
        return response.status(200).json({ result: false, message: 'user is not in this room' });

      const msgGroup = room.messagegroups[0];

      const newMessage = await MessageModel.create({
        userUserId: userId,
        content: content,
      });
      await room.addMessage(newMessage);

      if (!msgGroup) {
        // nếu mà trong nhóm chưa có tin nhắn thì tạo mới msgGroup và thêm tin nhắn
        const newMsgGroup = await MessageGroupModel.create({
          userUserId: userId,
          roomchatRoomId: roomId,
        });
        await newMsgGroup.addMessage(newMessage);
        newMessage.messagegroupId = newMsgGroup.id;

        var data = await MessageGroupModel.findByPk(newMsgGroup.id, {
          include: [
            {
              model: UserModel,
              attributes: ['avatar', 'userId', 'userName', 'email', 'phoneNumber'],
            },
            {
              model: MessageModel,
              attributes: [
                'createTimeStr',
                'last',
                'messageId',
                'content',
                'createAt',
                'deleteAt',
                'userUserId',
                'roomchatRoomId',
                'messagegroupId',
              ],
              order: [
                ['createAt', 'ASC'],
                ['messageId', 'ASC'],
              ],
              include: {
                model: ReactionModel,
                include: {
                  model: EmotionModel,
                },
              },
            },
          ],
        });

        data = data.toJSON();
        data.myself = true;
        for (var msg of data.messages) {
          msg.reactions = reactionFormater(msg.reactions);
        }

        return response.status(200).json({ data: data });
      } else {
        var current = new Date();
        let minutes = Math.floor(Math.abs(current - msgGroup.createAt) / 60000);

        if (minutes > 2 || msgGroup.userUserId !== userId) {
          // nếu mà nhóm tin nhắn cuối cùng được tạo ra cách  quá 2 phút
          // hoặc ko phải của chính người gửi
          // thì tạo mới nhóm tin nhắn và thêm 1 tin nhắn vào
          const newMsgGroup = await MessageGroupModel.create({
            userUserId: userId,
            roomchatRoomId: roomId,
          });
          await room.addMessage(newMessage);
          await newMsgGroup.addMessage(newMessage);

          let group = await MessageGroupModel.findByPk(newMsgGroup.id, {
            include: [
              {
                model: UserModel,
                attributes: ['avatar', 'userId', 'userName', 'email', 'phoneNumber'],
              },
              {
                model: MessageModel,
                attributes: [
                  'createTimeStr',
                  'last',
                  'messageId',
                  'content',
                  'createAt',
                  'deleteAt',
                  'userUserId',
                  'roomchatRoomId',
                  'messagegroupId',
                ],
                order: [
                  ['createAt', 'ASC'],
                  ['messageId', 'ASC'],
                ],
                include: {
                  model: ReactionModel,
                  include: {
                    model: EmotionModel,
                  },
                },
              },
            ],
          });

          var groupJson = group.toJSON();
          groupJson.myself = true;
          newMessage.messagegroupId = newMsgGroup.id;

          for (var msg of groupJson.messages) {
            msg.reactions = reactionFormater(msg.reactions);
          }

          return response.status(200).json({ data: groupJson });
        } else {
          // nếu nhóm tin nhắn ko quá 2 phút
          // thêm tin nhắn vào nhóm cũ
          await room.addMessage(newMessage);
          await msgGroup.addMessage(newMessage);
          newMessage.messagegroupId = msgGroup.id;
          // trả về nhóm tin nhắn cũ cùng tin nhắn mới

          let group = await MessageGroupModel.findByPk(msgGroup.id, {
            include: [
              {
                model: UserModel,
                attributes: ['avatar', 'userId', 'userName', 'email', 'phoneNumber'],
              },
              {
                model: MessageModel,
                attributes: [
                  'createTimeStr',
                  'last',
                  'messageId',
                  'content',
                  'createAt',
                  'deleteAt',
                  'userUserId',
                  'roomchatRoomId',
                  'messagegroupId',
                ],
                order: [
                  ['createAt', 'ASC'],
                  ['messageId', 'ASC'],
                ],
                include: {
                  model: ReactionModel,
                  include: {
                    model: EmotionModel,
                  },
                },
              },
            ],
          });

          var groupJson = group.toJSON();
          groupJson.myself = true;
          for (var msg of groupJson.messages) {
            msg.reactions = reactionFormater(msg.reactions);
          }
          return response.status(200).json({ data: groupJson });
        }
      }
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ message: error.message });
    }
  }

  async getMessagesInRoom(req, res, next) {
    const currentPage = req.query.page || 1;
    const itemsPerPage = req.query.per_page || 10; // Số bản ghi trên mỗi trang
    const offset = (currentPage - 1) * itemsPerPage; // Tính OFFSET
    const userId = req.userId;
    const roomid = req.query.roomid;

    if (!roomid) return res.status(400).json({ result: false, message: 'roomid is not attached' });
    try {
      var room = await RoomChatModel.findByPk(roomid, {
        include: {
          model: UserModel,
        },
      });

      room = room.toJSON();
      if (room.users.length === 2 && room.avatar === null) {
        let avatarRoom = room.users.find((user) => {
          return user.userId !== userId;
        }).avatar;
        room.avatar = avatarRoom;
      }

      var data = await MessageGroupModel.findAll({
        where: {
          roomchatRoomId: roomid,
        },
        include: [
          {
            model: UserModel,
            attributes: {
              exclude: ['password', 'updateAt', 'createAt'],
            },
          },
          {
            model: MessageModel,
            as: 'messages',
            where: {
              deleteAt: null,
            },
            include: {
              model: ReactionModel,
              include: {
                model: EmotionModel,
              },
            },
            order: [['messageId', 'ASC']],
          },
        ],
        limit: Number(itemsPerPage),
        offset: offset,
        order: [['createAt', 'DESC']],
      });

      data.reverse();
      if (room.roomName === null) {
        room.roomName = room.users.find((user) => user.userId !== userId).userName;
      }

      var JsonData = data.map((item) => {
        item = item.toJSON();
        item.myself = item.userUserId === userId;

        item.messages = item.messages.map((msg) => {
          msg.reactions = reactionFormater(msg.reactions);
          return msg;
        });

        item.messages = item.messages.sort((a, b) => {
          return a.messageId - b.messageId;
        });
        return item;
      });

      return res.status(200).json({ room: room, data: JsonData });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteMessage(request, response, next) {
    const messageId = request.query.message_id;
    const userid = request.userId;

    if (!messageId) throw new ValidationError({ message_id: 'message_id must be attached' });

    const message = await MessageModel.findOne({
      where: {
        messageId: messageId,
        userUserId: userid,
        deleteAt: null,
      },
    });

    if (message === null) throw new NotFoundError({ message: 'Not found Message' });

    message.deleteAt = new Date();
    await message.save();

    return response
      .status(200)
      .json({ isSuccess: true, message: 'Delete message successfully', message: message });
  }

  async findMessageInRoom(req, response, next) {
    const message = req.query.message;
    const userId = req.userId;
    const roomId = req.query.room_id;

    if (!roomId)
      throw new ValidationError({
        room_id: 'room_id must be attached',
      });

    if (isNaN(Number(roomId)))
      throw new ValidationError({ room_id: 'room_id must be of type Integer' });

    if (!message)
      throw new ValidationError({
        message: 'message must be attached',
      });

    if (message.trim() === '') throw new ValidationError({ message: 'message is invalid' });

    const messages = await MessageModel.findAll({
      where: {
        userUserId: userId,
        roomchatRoomId: roomId,
        content: {
          [Op.like]: `%${message}%`,
        },
      },
    });

    return response.status(200).json({
      isSuccess: true,
      data: messages,
    });
  }
}

module.exports = new MessageController();
