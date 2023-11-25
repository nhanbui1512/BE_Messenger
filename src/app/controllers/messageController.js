const { MessageModel, RoomChatModel, UserModel } = require("../models");

class MessageController {
  async sendMessage(request, response, next) {
    try {
      const content = request.body.content;
      const roomId = request.body.roomId;

      const newMessage = await MessageModel.create({
        userUserId: 1,
        content: content,
      });
      const room = await RoomChatModel.findByPk(roomId);
      await room.addMessage(newMessage);

      return response.status(200).json({ result: true });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
  async getMessagesInRoom(req, res, next) {
    try {
      const roomid = req.query.roomid;
      const room = await RoomChatModel.findByPk(roomid);
      const messages = await MessageModel.findAll({
        attributes: {
          exclude: ["roomchatRoomId"],
        },
        include: { model: UserModel },
        where: {
          roomchatRoomId: roomid,
        },
      });

      return res.status(200).json({ room: room, messages: messages });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MessageController();
