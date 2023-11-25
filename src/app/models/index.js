const { Sequelize, DataTypes, Op, fn } = require("sequelize");
const User = require("./user");
const RoomChat = require("./roomChat");
const Message = require("./message");

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

module.exports = { sequelize, UserModel, RoomChatModal, MessageModal };
