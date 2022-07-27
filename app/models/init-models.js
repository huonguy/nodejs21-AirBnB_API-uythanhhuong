var DataTypes = require("sequelize").DataTypes;
var _country = require("./country");
var _location = require("./location");
var _province = require("./province");
var _review = require("./review");
var _roles = require("./roles");
var _room = require("./room");
var _room_detail = require("./room_detail");
var _ticket = require("./ticket");
var _users = require("./users");
var _users_detail = require("./users_detail");

function initModels(sequelize) {
  var country = _country(sequelize, DataTypes);
  var location = _location(sequelize, DataTypes);
  var province = _province(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var room = _room(sequelize, DataTypes);
  var room_detail = _room_detail(sequelize, DataTypes);
  var ticket = _ticket(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var users_detail = _users_detail(sequelize, DataTypes);

  province.belongsTo(country, { as: "country", foreignKey: "countryId"});
  country.hasMany(province, { as: "provinces", foreignKey: "countryId"});
  room.belongsTo(location, { as: "location", foreignKey: "locationId"});
  location.hasMany(room, { as: "rooms", foreignKey: "locationId"});
  location.belongsTo(province, { as: "province", foreignKey: "provinceId"});
  province.hasMany(location, { as: "locations", foreignKey: "provinceId"});
  users.belongsTo(roles, { as: "role", foreignKey: "roleId"});
  roles.hasMany(users, { as: "users", foreignKey: "roleId"});
  review.belongsTo(room, { as: "room", foreignKey: "roomId"});
  room.hasMany(review, { as: "reviews", foreignKey: "roomId"});
  room_detail.belongsTo(room, { as: "room", foreignKey: "roomId"});
  room.hasOne(room_detail, { as: "room_detail", foreignKey: "roomId"});
  ticket.belongsTo(room, { as: "room", foreignKey: "roomId"});
  room.hasMany(ticket, { as: "tickets", foreignKey: "roomId"});
  review.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(review, { as: "reviews", foreignKey: "userId"});
  ticket.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(ticket, { as: "tickets", foreignKey: "userId"});
  users_detail.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasOne(users_detail, { as: "users_detail", foreignKey: "userId"});

  return {
    country,
    location,
    province,
    review,
    roles,
    room,
    room_detail,
    ticket,
    users,
    users_detail,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
