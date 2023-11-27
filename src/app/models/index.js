const { Sequelize, DataTypes, Op, fn } = require('sequelize');
const User = require('./userModel');
const RoomChat = require('./roomChatModel');
const Message = require('./messageModel');
const UserRoomchat = require('./userRoomchatModel');
const Emotion = require('./emotionModel');
const Reaction = require('./reactionModel');

const sequelize = new Sequelize('messenger', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

const UserModel = User(sequelize);
const RoomChatModel = RoomChat(sequelize);
const UserRoomchatModel = UserRoomchat(sequelize);
const MessageModel = Message(sequelize);
const EmotionModel = Emotion(sequelize);
const ReactionModel = Reaction(sequelize);
//realationship

UserModel.hasMany(MessageModel, {
  onDelete: 'CASCADE',
});
MessageModel.belongsTo(UserModel, {
  onDelete: 'CASCADE',
});

RoomChatModel.hasMany(MessageModel, {
  onDelete: 'CASCADE',
});
MessageModel.belongsTo(RoomChatModel, {
  onDelete: 'CASCADE',
});

UserModel.belongsToMany(RoomChatModel, { through: UserRoomchatModel });
RoomChatModel.belongsToMany(UserModel, { through: UserRoomchatModel });

MessageModel.hasMany(ReactionModel, {
  onDelete: 'CASCADE',
});

ReactionModel.belongsTo(MessageModel, {
  onDelete: 'CASCADE',
});

EmotionModel.hasMany(ReactionModel, {
  onDelete: 'CASCADE',
});
ReactionModel.belongsTo(EmotionModel, {
  onDelete: 'CASCADE',
});

UserModel.hasMany(ReactionModel, {
  onDelete: 'CASCADE',
});
ReactionModel.belongsTo(UserModel, {
  onDelete: 'CASCADE',
});
module.exports = {
  sequelize,
  UserModel,
  RoomChatModel,
  MessageModel,
  UserRoomchatModel,
  EmotionModel,
};
