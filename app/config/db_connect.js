const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "db_AirBnB", //database name
//   "root", //username
//   "admin123", //password
//   {
//     host: "127.0.0.1", //url sql server, RDMS
//     port: "3308", //port
//     dialect: "mysql", //sql server dang su dung
//   }
// );

const sequelize = new Sequelize(
  "heroku_652930bd7ed8003", //database name
  "b07acb687d3809", //username
  "e3ca9b30", //password
  {
    host: "us-cdbr-east-06.cleardb.net", //url sql server, RDMS
    port: "3306", //port
    dialect: "mysql", //sql server dang su dung
  }
);

const checkConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("kết nối thành công");
  } catch (error) {
    console.log("kết nối thất bại");
    console.log(error);
  }
};

// checkConnect();

module.exports = sequelize;
