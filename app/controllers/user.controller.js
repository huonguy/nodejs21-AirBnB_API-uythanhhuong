const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const path = require("path");

const bcrypt = require("bcryptjs");
const { createId } = require("../helper/util");

const getAllUser = async (req, res) => {
  try {
    // const users = await models.users.findAll();

    const [results, metadata] = await sequelize.query(
      `SELECT u._id, u.email, u.password, u.roleId, ud.name, ud.gender, ud.phone, ud.birthday, ud.address, ud.avatar FROM users u
            JOIN users_detail ud ON u._id = ud.userId`
    );

    if (results.length != 0) res.status(200).send(results);
    else res.status(200).send("Không có thông tin người dùng!");
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req, res) => {
  const { _id } = req.params;

  try {
    const users = await models.users.findOne({
      where: {
        _id,
      },
    });

    const usersDetail = await models.users_detail.findOne({
      where: {
        userId: _id,
      },
    });

    if (users) {
      const { userId, ...uDetailRest } = usersDetail.dataValues;

      const result = {
        ...users.dataValues,
        ...uDetailRest,
      };

      res.status(200).send(result);
    } else {
      res.status(404).send("Người dùng không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const createUser = async (req, res) => {
  const { name, email, password, phone, birthday, gender, roleId, address } =
    req.body;

  //tạo độ dài của thuật toán mã hóa bcrypt
  const salt = bcrypt.genSaltSync(10);
  //mã hóa password dựa trên độ dài đã tạo
  const hashPassword = bcrypt.hashSync(password, salt);

  try {
    const _id = createId();

    const users = await models.users.create({
      _id,
      email,
      password: hashPassword,
      roleId,
      createdDate: Date.now(),
    });

    const usersDetail = await models.users_detail.create({
      userId: _id,
      name,
      phone,
      birthday,
      gender,
      address,
    });

    const { userId, avatar, ...uDetailRest } = usersDetail.dataValues;

    const result = {
      ...users.dataValues,
      ...uDetailRest,
    };

    res.status(201).send({
      message: "Tạo người dùng thành công!",
      status_code: 201,
      success: true,
      user: result,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};

const deleteUser = async (req, res) => {
  const { _id } = req.params;

  try {
    const existedUsers = await models.users.findOne({
      where: {
        _id,
      },
    });

    await models.users_detail.findOne({
      where: {
        userId: _id,
      },
    });

    if (existedUsers) {
      models.users_detail.destroy({
        where: {
          userId: _id,
        },
      });

      models.users.destroy({
        where: {
          _id,
        },
      });
      res.status(200).send({
        message: "Xóa người dùng thành công!",
        status_code: 200,
        success: true,
      });
    } else {
      res.status(404).send("Người dùng không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUser = async (req, res) => {
  const { _id } = req.params;
  const { email, name, phone, birthday, gender, roleId, address } = req.body;

  try {
    let existedUsers = await models.users.findOne({
      where: {
        _id,
      },
    });

    let existedUsersDetail = await models.users_detail.findOne({
      where: {
        userId: _id,
      },
    });

    if (existedUsers) {
      existedUsers.email = email;
      existedUsers.roleId = roleId;
      existedUsers.createdDate = Date.now();

      existedUsersDetail.name = name;
      existedUsersDetail.phone = phone;
      existedUsersDetail.birthday = birthday;
      existedUsersDetail.gender = gender;
      existedUsersDetail.address = address;

      await existedUsers.save();
      await existedUsersDetail.save();

      const { userId, ...uDetailRest } = existedUsersDetail.dataValues;

      const result = {
        ...existedUsers.dataValues,
        ...uDetailRest,
      };

      res.status(200).send({
        message: "Cập nhật người dùng thành công!",
        status_code: 200,
        success: true,
        user: result,
      });
    } else {
      res.status(404).send("Người dùng không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const uploadAvatar = async (req, res) => {
  const _id = req.user._id;
  const avatar = req.file.path;

  try {
    if (!req.file) {
      res.status(404).send("Chưa chọn hình ảnh!");
    } else {
      let existedUsers = await models.users.findOne({
        where: {
          _id,
        },
      });

      let existedUsersDetail = await models.users_detail.findOne({
        where: {
          userId: _id,
        },
      });

      if (existedUsers) {
        existedUsers.createdDate = Date.now();
        existedUsersDetail.avatar =
          req.protocol +
          "://" +
          path.join(req.headers.host, avatar).replace(/\\/g, "/");

        await existedUsersDetail.save();

        const { userId, ...uDetailRest } = existedUsersDetail.dataValues;

        const result = {
          ...existedUsers.dataValues,
          ...uDetailRest,
        };

        res.status(200).send({
          message: "Cập nhật ảnh người dùng thành công!",
          status_code: 200,
          success: true,
          user: result,
        });
      } else {
        res.status(404).send("Người dùng không tồn tại!");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  uploadAvatar,
};
