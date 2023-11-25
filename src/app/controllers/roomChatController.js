const { RoomChatModal, UserModel } = require("../models");

class RoomChatController {
  async getAll(req, res, next) {}
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
