const { Sequelize, DataTypes, Op, fn } = require("sequelize");
const User = require("./userModel");
const RoomChat = require("./roomChatModel");
const Message = require("./messageModel");
const UserRoomchat = require("./userRoomchatModel");

const sequelize = new Sequelize("messenger", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

const UserModel = User(sequelize);
const RoomChatModel = RoomChat(sequelize);
const MessageModel = Message(sequelize);
const UserRoomchatModel = UserRoomchat(sequelize);

//realationship

UserModel.hasMany(MessageModel, {
  onDelete: "CASCADE",
});
MessageModel.belongsTo(UserModel, {
  onDelete: "CASCADE",
});

RoomChatModel.hasMany(MessageModel, {
  onDelete: "CASCADE",
});
MessageModel.belongsTo(RoomChatModel, {
  onDelete: "CASCADE",
});

UserModel.belongsToMany(RoomChatModel, { through: UserRoomchatModel });
RoomChatModel.belongsToMany(UserModel, { through: UserRoomchatModel });

module.exports = {
  sequelize,
  UserModel,
  RoomChatModel,
  MessageModel,
  UserRoomchatModel,
};
