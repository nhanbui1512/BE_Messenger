const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const { reactionFormater } = require('../until/reaction');
const {
  ReactionModel,
  EmotionModel,
  MessageModel,
  RoomChatModel,
  UserModel,
  UserRoomchatModel,
} = require('../models');
class ReactionController {
  async createReaction(req, response, next) {
    const idmsg = req.query.idmsg;
    const userId = req.userId;
    const emotionName = req.query.emotion;
    const errors = [];

    if (!emotionName) errors.push({ emotionName: 'emotionName is invalid' });
    if (!idmsg) errors.push({ idmsg: 'idmsg is invalid' });

    if (errors.length > 0) throw new ValidationError(errors);

    const emotion = await EmotionModel.findOne({
      where: {
        name: emotionName,
      },
    });

    if (emotion === null) errors.push({ emotion: 'emotion not found' });

    const msg = await MessageModel.findOne({
      where: {
        messageId: idmsg,
      },
      include: {
        model: RoomChatModel,
      },
    });

    const isExistUserInRoom = await UserRoomchatModel.findOne({
      // check user in room
      where: {
        userUserId: userId,
        roomchatRoomId: msg.roomchat.roomId,
      },
    });

    if (isExistUserInRoom === null)
      throw new NotFoundError({ user: 'User is not exist in the room chat' });

    if (msg === null) errors.push({ message: 'message not found' });

    if (errors.length > 0) throw new NotFoundError(errors);

    const isExistReaction = await ReactionModel.findOne({
      where: {
        userUserId: userId,
        messageMessageId: idmsg,
      },
    });

    if (isExistReaction === null) {
      const newReaction = await ReactionModel.create({
        messageMessageId: idmsg,
        userUserId: userId,
      });

      await emotion.addReaction(newReaction);

      var message = await MessageModel.findOne({
        where: {
          messageId: idmsg,
        },
        include: {
          model: ReactionModel,
          include: {
            model: EmotionModel,
          },
        },
      });

      message = message.toJSON();
      message.reactions = reactionFormater(message.reactions);

      return response.status(200).json({
        isSuccess: true,
        message: 'Create reaction successfully',
        reaction: newReaction,
        dataMessage: message,
      });
    } else {
      if (isExistReaction.emotionId !== emotion.id) {
        isExistReaction.emotionId = emotion.id;
        await isExistReaction.save();
      }

      var message = await MessageModel.findOne({
        where: {
          messageId: idmsg,
        },
        include: {
          model: ReactionModel,
          include: {
            model: EmotionModel,
          },
        },
      });

      message = message.toJSON();
      message.reactions = reactionFormater(message.reactions);

      return response.status(200).json({
        isSuccess: true,
        message: 'Create reaction successfully',
        reaction: isExistReaction,
        dataMessage: message,
      });
    }
  }

  async deleteReaction(req, response, next) {
    const userId = req.userId;
    const msgId = req.query.msg_id;

    if (!msgId) throw new ValidationError({ msg_id: 'msg_id must be attached' });

    const reaction = await ReactionModel.findOne({
      where: {
        userUserId: userId,
        messageMessageId: msgId,
      },
    });

    if (reaction === null) throw new NotFoundError({ reaction: 'Reaction is not found' });

    await reaction.destroy();

    var message = await MessageModel.findByPk(msgId, {
      include: {
        model: ReactionModel,
        include: {
          model: EmotionModel,
        },
      },
    });

    message = message.toJSON();
    message.reactions = reactionFormater(message.reactions);

    return response.status(200).json({
      isSuccess: true,
      message: 'Delete reaction successfuly',
      reaction: reaction,
      dataMessage: message,
    });
  }
}

module.exports = new ReactionController();
