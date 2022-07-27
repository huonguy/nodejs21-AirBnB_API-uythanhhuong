const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const { createId } = require("../helper/util");

const getAllLocation = async (req, res) => {
  try {
    const locations = await models.location.findAll();

    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getLocationById = async (req, res) => {
  const { _id } = req.params;

  try {
    const location = await models.location.findOne({
      where: {
        _id,
      },
    });

    if (location) {
      res.status(200).send(location);
    } else {
      res.status(404).send("Location Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getLocationByValueate = async (req, res) => {
  const { valueate } = req.query;

  try {
    const locations = await models.location.findAll({
      where: {
        valueate,
      },
    });

    if (locations.length != 0) {
      res.status(200).send(locations);
    } else {
      res.status(404).send("Location Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const createLocation = async (req, res) => {
  try {
    const _id = createId();

    const newLocation = await models.location.create({
      _id,
      ...req.body,
    });

    res.status(201).send(newLocation);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteLocation = async (req, res) => {
  const { _id } = req.params;

  try {
    const existedLocation = await models.location.findOne({
      where: {
        _id,
      },
    });

    if (existedLocation) {
      models.location.destroy({
        where: {
          _id,
        },
      });

      res.status(200).send(existedLocation);
    } else {
      res.status(404).send("Location Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateLocation = async (req, res) => {
  const { _id } = req.params;
  const { location_name, provinceId, valueate } = req.body;

  try {
    let existedLocation = await models.location.findOne({
      where: {
        _id,
      },
    });

    if (existedLocation) {
      existedLocation.locationName = location_name;
      existedLocation.provinceId = provinceId;
      existedLocation.valueate = valueate;

      await existedLocation.save();

      res.status(200).send(existedLocation);
    } else {
      res.status(404).send("Location Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const uploadLocImage = async (req, res) => {
  const { _id } = req.params;
  const location = req.file.path;

  try {
    if (!req.file) {
      res.status(404).send("No File Uploaded!");
    } else {
      let existedLocation = await models.location.findOne({
        where: {
          _id,
        },
      });

      if (existedLocation) {
        existedLocation.image = location;

        await existedLocation.save();
        res.status(200).send(existedLocation);
      } else {
        res.status(404).send("Location Not Found!");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllLocation,
  getLocationById,
  getLocationByValueate,
  createLocation,
  deleteLocation,
  updateLocation,
  uploadLocImage,
};
