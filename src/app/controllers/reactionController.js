const { ReactionModel } = require('../models');
class ReactionController {
  async createReaction(req, response, next) {
    const idmsg = req.query.idmsg;
    const userId = req.userId;
    const idEmotion = req.query.emotion;

    if (!idEmotion)
      return response.status(500).json({ result: false, message: 'emotion must be attached' });
    if (!idmsg)
      return response.status(500).json({ result: false, message: 'idmsg must be attached' });

    return response.send('create reactions');
  }
}

module.exports = new ReactionController();
