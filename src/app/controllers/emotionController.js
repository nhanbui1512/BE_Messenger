const { EmotionModel } = require('../models');

class ReactController {
  async getAllEmotion(req, response, next) {
    try {
      const emotions = await EmotionModel.findAll();
      return response.status(200).json({ data: emotions });
    } catch (error) {
      return response.status(500).json({ reuslt: false, message: error.message });
    }
  }
  async createEmotion(req, response, next) {}
}

module.exports = new ReactController();
