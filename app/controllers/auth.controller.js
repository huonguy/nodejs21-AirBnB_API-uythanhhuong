const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const { generateToken, decodeToken } = require("../helper/jwt.helper");
const { createId } = require("../helper/util");

const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await models.users.findOne({
      where: {
        email,
      },
    });

    const userDetail = await models.users_detail.findOne({
      where: {
        userId: user._id,
      },
    });

    const role = await models.roles.findOne({
      where: {
        _id: user.roleId,
      },
    });

    const payload = {
      _id: user._id,
      email: user.email,
      role: role.role_type,
      name: userDetail.name,
      gender: userDetail.gender,
      phone: userDetail.phone,
      birthday: userDetail.birthday,
      address: userDetail.address,
      avatar: userDetail.avatar,
    };

    if (user != null) {
      //Đăng nhập thành công
      const isSuccess = bcrypt.compareSync(password, user.password);
      if (isSuccess) {
        //generate token
        const token = generateToken(payload);

        res.status(200).send({
          message: "Loggin successfully!",
          status_code: 200,
          success: true,
          access_token: token,
        });
      }
    } else {
      //Đăng nhập thất bại
      res.status(401).send({
        message: "Login failed. Please try again!",
        status_code: 401,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const register = async (req, res) => {
  const { name, email, password, phone, birthday, gender, roleId, address } =
    req.body;

  //tạo độ dài của thuật toán mã hóa bcrypt
  const salt = bcrypt.genSaltSync(10);
  //mã hóa password dựa trên độ dài đã tạo
  const hashPassword = bcrypt.hashSync(password, salt);

  try {
    const _id = createId();

    await models.users.create({
      _id,
      email,
      password: hashPassword,
      roleId,
    });

    await models.users_detail.create({
      userId: _id,
      name,
      gender,
      phone,
      birthday,
      address,
    });

    res.status(201).send({
      message: "Register successfully!",
      status_code: 201,
      success: true,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Xác thực xem đăng nhập hay chưa
const authenticate = (req, res, next) => {
  const token = req.header("token");

  try {
    const decode = decodeToken(token);

    if (decode) {
      req.user = decode.data;
      return next();
    } else {
      res.status(401).send({
        message: "You have not logged in!",
        status_code: 401,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

//phân quyền
const authorize = (arrType) => (req, res, next) => {
  const { user } = req;
  console.log("user", user);
  if (arrType.findIndex((ele) => ele === user.role) > -1) {
    return next();
  } else {
    res.status(403).send({
      message: "You are not authorized to perform this action!",
      status_code: 403,
      success: false,
    });
  }
};

module.exports = {
  login,
  register,
  authenticate,
  authorize,
};
