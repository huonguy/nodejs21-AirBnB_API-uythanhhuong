const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const bcrypt = require("bcryptjs");
const { createId } = require("../helper/util");

const getAllUser = async (req, res) => {
  try {
    // const users = await models.users.findAll();

    const [results, metadata] = await sequelize.query(
      "SELECT * FROM users JOIN users_detail ON users._id = users_detail.userId"
    );

    res.status(200).send(results);
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
      res.status(200).send({
        ...users.dataValues,
        ...usersDetail.dataValues,
      });
    } else {
      res.status(404).send("User Not Found!");
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

    const newUsers = await models.users.create({
      _id,
      email,
      password: hashPassword,
      roleId,
    });

    const newUsersDetail = await models.users_detail.create({
      userId: _id,
      name,
      gender,
      phone,
      birthday,
      address,
    });

    res
      .status(201)
      .send({ ...newUsers.dataValues, ...newUsersDetail.dataValues });
  } catch (error) {
    res.status(500).send(error);
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

    const existedUsersDetail = await models.users_detail.findOne({
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
        ...existedUsers.dataValues,
        ...existedUsersDetail.dataValues,
      });
    } else {
      res.status(404).send("User Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUser = async (req, res) => {
  const { _id } = req.params;
  const { email, password, roleId, name, gender, phone, birthday, address } =
    req.body;

  try {
    const existedUsers = await models.users.findOne({
      where: {
        _id,
      },
    });

    const existedUsersDetail = await models.users_detail.findOne({
      where: {
        userId: _id,
      },
    });

    if (existedUsers) {
      existedUsers.email = email;
      existedUsers.password = password;
      existedUsers.roleId = roleId;

      existedUsersDetail.name = name;
      existedUsersDetail.gender = gender;
      existedUsersDetail.phone = phone;
      existedUsersDetail.birthday = birthday;
      existedUsersDetail.address = address;

      await existedUsers.save();
      await existedUsersDetail.save();

      res
        .status(200)
        .send({ ...existedUsers.dataValues, ...existedUsersDetail.dataValues });
    } else {
      res.status(404).send("User Not Found!");
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
      res.status(404).send("No File Uploaded!");
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
        existedUsersDetail.avatar = avatar;

        await existedUsersDetail.save();
        res.status(200).send({
          ...existedUsers.dataValues,
          ...existedUsersDetail.dataValues,
        });
      } else {
        res.status(404).send("User Not Found!");
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
