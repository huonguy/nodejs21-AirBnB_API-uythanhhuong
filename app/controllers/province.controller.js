const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const getAllProvince = async (req, res) => {
  try {
    const provinces = await models.province.findAll();
    res.status(200).send(provinces);
  } catch (error) {
    res.status(500).send({ error });
  }
};

module.exports = {
  getAllProvince,
};
