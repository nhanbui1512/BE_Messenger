const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/NotFoundError');

const { ReactionModel, EmotionModel, MessageModel } = require('../models');
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
        userUserId: userId,
      },
    });

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

      return response.status(200).json({
        isSuccess: true,
        message: 'Create reaction successfully',
        reaction: newReaction,
      });
    }

    if (isExistReaction.emotionId !== emotion.id) {
      isExistReaction.emotionId = emotion.id;
      await isExistReaction.save();
    }

    return response.status(200).json({
      isSuccess: true,
      message: 'Create reaction successfully',
      reaction: isExistReaction,
    });
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

    return response
      .status(200)
      .json({ isSuccess: true, message: 'delete reaction successfuly', reaction: reaction });
  }
}

module.exports = new ReactionController();
