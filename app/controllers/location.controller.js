const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const path = require("path");

const { createId } = require("../helper/util");

const getAllLocation = async (req, res) => {
  try {
    // const locations = await models.location.findAll();

    const [results, metadata] = await sequelize.query(
      `SELECT l._id, l.name, p._id as provinceId, p.countryId, l.valueate, l.image FROM location l 
            JOIN province p ON l.provinceId = p._id`
    );

    if (results.length != 0) res.status(200).send(results);
    else res.status(200).send("Không có thông tin địa điểm!");
  } catch (error) {
    res.status(500).send({ error });
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

    const province = await models.province.findOne({
      where: {
        _id: location.provinceId,
      },
    });

    if (location) {
      const result = {
        ...location.dataValues,
        countryId: province.countryId,
      };

      res.status(200).send(result);
    } else {
      res.status(404).send("Địa điểm không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const createLocation = async (req, res) => {
  try {
    const _id = createId();
    const { name, provinceId, valueate } = req.body;

    const newLocation = await models.location.create({
      _id,
      name,
      provinceId,
      valueate,
      createdDate: Date.now(),
    });

    const province = await models.province.findOne({
      where: {
        _id: provinceId,
      },
    });

    const result = {
      ...newLocation.dataValues,
      countryId: province.countryId,
    };

    res.status(201).send({
      message: "Tạo địa điểm thành công!",
      status_code: 201,
      success: true,
      location: result,
    });
  } catch (error) {
    res.status(500).send({ error });
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

      res.status(200).send({
        message: "Xóa địa điểm thành công!",
        status_code: 200,
        success: true,
      });
    } else {
      res.status(404).send("Địa điểm không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateLocation = async (req, res) => {
  const { _id } = req.params;
  const { name, provinceId, valueate } = req.body;

  try {
    let existedLocation = await models.location.findOne({
      where: {
        _id,
      },
    });

    const province = await models.province.findOne({
      where: {
        _id: provinceId,
      },
    });

    if (existedLocation) {
      existedLocation.name = name;
      existedLocation.provinceId = provinceId;
      existedLocation.valueate = valueate;
      existedLocation.createdDate = Date.now();

      await existedLocation.save();

      const result = {
        ...existedLocation.dataValues,
        countryId: province.countryId,
      };

      res.status(200).send({
        message: "Cập nhật địa điểm thành công!",
        status_code: 200,
        success: true,
        location: result,
      });
    } else {
      res.status(404).send("Địa điểm không tồn tại!");
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
      res.status(404).send("Chưa chọn hình ảnh!");
    } else {
      let existedLocation = await models.location.findOne({
        where: {
          _id,
        },
      });

      const province = await models.province.findOne({
        where: {
          _id: existedLocation.provinceId,
        },
      });

      if (existedLocation) {
        existedLocation.createdDate = Date.now();
        existedLocation.image =
          req.protocol +
          "://" +
          path.join(req.headers.host, location).replace(/\\/g, "/");

        await existedLocation.save();

        const result = {
          ...existedLocation.dataValues,
          countryId: province.countryId,
        };
        res.status(200).send({
          message: "Cập nhật ảnh địa điểm thành công!",
          status_code: 200,
          success: true,
          location: result,
        });
      } else {
        res.status(404).send("Địa điểm không tồn tại!");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllLocation,
  getLocationById,
  createLocation,
  deleteLocation,
  updateLocation,
  uploadLocImage,
};
