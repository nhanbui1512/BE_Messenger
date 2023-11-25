const { RoomChatModal, UserModel, UserRoomchatModal } = require("../models");

class RoomChatController {
  async getAll(req, res, next) {
    const rooms = await RoomChatModal.findAll({
      include: {
        model: UserModel,
        through: { attributes: [] },
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return res.status(200).json(rooms);
  }
  async addUserIntoRoom(req, res, next) {
    const userIds = req.body.users;
    const roomId = req.body.roomId;

    try {
      const users = await UserModel.findAll({
        where: {
          userId: userIds,
        },
      });

      const room = await RoomChatModal.findByPk(roomId);
      const result = await room.addUsers(users);

      if (!result) {
        return res.send("existed");
      }
      return res.send("join room successfully");
    } catch (error) {
      console.log(error.message);
      return res.send("error");
    }
  }
}
module.exports = new RoomChatController();
