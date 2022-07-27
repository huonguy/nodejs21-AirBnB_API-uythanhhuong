const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "db_AirBnB", //database name
  "root", //username
  "admin123", //password
  {
    host: "127.0.0.1", //url sql server, RDMS
    port: "3308", //port
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
