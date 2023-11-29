const { Sequelize, DataTypes, Op, fn } = require('sequelize');
const User = require('./userModel');
const RoomChat = require('./roomChatModel');
const Message = require('./messageModel');
const UserRoomchat = require('./userRoomchatModel');
const Emotion = require('./emotionModel');
const Reaction = require('./reactionModel');
const MessageGroup = require('./messageGroupModel');

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
const MessageGroupModel = MessageGroup(sequelize);

//realationship

UserModel.hasMany(MessageModel, { onDelete: 'CASCADE' }); // USER vs MESSAGES
MessageModel.belongsTo(UserModel, { onDelete: 'CASCADE' });

RoomChatModel.hasMany(MessageModel, { onDelete: 'CASCADE' }); // ROOM vs MESSAGES
MessageModel.belongsTo(RoomChatModel, { onDelete: 'CASCADE' });

UserModel.belongsToMany(RoomChatModel, { through: UserRoomchatModel }); // USER - USER_ROOM - ROOM
RoomChatModel.belongsToMany(UserModel, { through: UserRoomchatModel });

MessageModel.hasMany(ReactionModel, { onDelete: 'CASCADE' }); // REACTIONS vs MESSAGES
ReactionModel.belongsTo(MessageModel, { onDelete: 'CASCADE' });

MessageGroupModel.hasMany(MessageModel, { onDelete: 'CASCADE' }); // MESSAGE GROUP vs MESSAGE
MessageModel.belongsTo(MessageGroupModel, { onDelete: 'CASCADE' });

UserModel.hasMany(MessageGroupModel, { onDelete: 'CASCADE' }); // MESSAGE GROUP vs USER
MessageGroupModel.belongsTo(UserModel, { onDelete: 'CASCADE' });

RoomChatModel.hasMany(MessageGroupModel, { onDelete: 'CASCADE' }); // MESSAGE GROUP vs ROOM
MessageGroupModel.belongsTo(RoomChatModel, { onDelete: 'CASCADE' });

EmotionModel.hasMany(ReactionModel, { onDelete: 'CASCADE' }); // EMOTION vs REACTIONS
ReactionModel.belongsTo(EmotionModel, { onDelete: 'CASCADE' });

UserModel.hasMany(ReactionModel, { onDelete: 'CASCADE' }); // USER vs REACTIONS
ReactionModel.belongsTo(UserModel, { onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  UserModel: sequelize.models.users,
  RoomChatModel: sequelize.models.roomchats,
  MessageModel: sequelize.models.messages,
  UserRoomchatModel: sequelize.models.userRoomchat,
  EmotionModel: sequelize.models.emotions,
  MessageGroupModel: sequelize.models.messagegroups,
};
