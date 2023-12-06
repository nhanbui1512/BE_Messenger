const { ReactionModel, EmotionModel, MessageModel } = require('../models');
class ReactionController {
  async createReaction(req, response, next) {
    const idmsg = req.query.idmsg;
    const userId = req.userId;
    const emotionName = req.query.emotion;

    if (!emotionName)
      return response.status(500).json({ result: false, message: 'emotion must be attached' });
    if (!idmsg)
      return response.status(500).json({ result: false, message: 'idmsg must be attached' });
    try {
      const emotion = await EmotionModel.findOne({
        where: {
          name: emotionName,
        },
      });

      if (emotion === null)
        return response.status(500).json({ result: false, message: 'not found emotion' });
      const msg = await MessageModel.findByPk(idmsg);

      if (msg === null)
        return response.status(500).json({ isSuccess: false, message: 'Not found message' });

      const isExistReaction = await ReactionModel.findOne({
        where: {
          userUserId: userId,
          messageMessageId: idmsg,
          emotionId: emotion.id,
        },
      });

      if (isExistReaction === null) {
        const newReaction = await ReactionModel.create({
          messageMessageId: idmsg,
          userUserId: userId,
        });

        await emotion.addReaction(newReaction);
      }

      return response
        .status(200)
        .json({ isSuccess: true, message: 'Create reaction successfully' });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ReactionController();
