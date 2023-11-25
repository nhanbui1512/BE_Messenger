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
const RoomChatModal = RoomChat(sequelize);
const MessageModal = Message(sequelize);
const UserRoomchatModal = UserRoomchat(sequelize);

//realationship

UserModel.hasMany(MessageModal, {
  onDelete: "CASCADE",
});
MessageModal.belongsTo(UserModel, {
  onDelete: "CASCADE",
});

RoomChatModal.hasMany(MessageModal, {
  onDelete: "CASCADE",
});
MessageModal.belongsTo(RoomChatModal, {
  onDelete: "CASCADE",
});

UserModel.belongsToMany(RoomChatModal, { through: UserRoomchatModal });
RoomChatModal.belongsToMany(UserModel, { through: UserRoomchatModal });

module.exports = {
  sequelize,
  UserModel,
  RoomChatModal,
  MessageModal,
  UserRoomchatModal,
};
