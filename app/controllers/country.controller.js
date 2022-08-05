const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const getAllCountry = async (req, res) => {
  try {
    const countries = await models.country.findAll();
    res.status(200).send(countries);
  } catch (error) {
    res.status(500).send({ error });
  }
};

module.exports = {
  getAllCountry,
};
