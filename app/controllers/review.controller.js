const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const { createId } = require("../helper/util");

const getReviewById = async (req, res) => {
  const { _id } = req.params;

  try {
    const review = await models.review.findOne({
      where: {
        _id,
      },
    });

    const userDetail = await models.users_detail.findOne({
      where: {
        userId: req.user._id,
      },
    });

    if (review) {
      const result = {
        ...review.dataValues,
        userName: userDetail.name,
        userAvatar: userDetail.avatar,
      };

      res.status(200).send(result);
    } else {
      res.status(200).send("Đánh giá không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReviewByRoom = async (req, res) => {
  const { roomId } = req.query;

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT r._id, r.content, r.createdDate, r.userId, r.roomId, ud.name as userName, ud.avatar as userAvatar FROM review r
          JOIN users_detail ud ON ud.userId = r.userId
          WHERE r.roomId = :roomId`,
      {
        replacements: { roomId },
      }
    );

    if (results.length != 0) {
      res.status(200).send(results);
    } else {
      res.status(200).send("Không có thông tin đánh giá!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const createReview = async (req, res) => {
  const { roomId } = req.query;
  const { content } = req.body;
  try {
    const _id = createId();
    const newReview = await models.review.create({
      _id,
      content,
      userId: req.user._id,
      roomId,
      createdDate: Date.now(),
    });

    const userDetail = await models.users_detail.findOne({
      where: {
        userId: req.user._id,
      },
    });

    const result = {
      ...newReview.dataValues,
      userName: userDetail.name,
      userAvatar: userDetail.avatar,
    };

    res.status(200).send({
      message: "Tạo đánh giá thành công!",
      status_code: 201,
      success: true,
      review: result,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteReview = async (req, res) => {
  const { _id } = req.params;

  try {
    const existedReview = await models.review.findOne({
      where: {
        _id,
      },
    });
    if (existedReview) {
      models.review.destroy({
        where: {
          _id,
        },
      });
      res.status(200).send({
        message: "Xóa đánh giá thành công!",
        status_code: 200,
        success: true,
      });
    } else {
      res.status(404).send("Đánh giá không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateReview = async (req, res) => {
  const { _id } = req.params;
  const { content } = req.body;

  try {
    let existedReview = await models.review.findOne({
      where: {
        _id,
      },
    });

    const userDetail = await models.users_detail.findOne({
      where: {
        userId: req.user._id,
      },
    });

    if (existedReview) {
      existedReview.content = content;
      existedReview.createdDate = Date.now();

      await existedReview.save();

      const result = {
        ...existedReview.dataValues,
        userName: userDetail.name,
        userAvatar: userDetail.avatar,
      };

      res.status(200).send({
        message: "Cập nhật đánh giá thành công!",
        status_code: 200,
        success: true,
        review: result,
      });
    } else {
      res.status(200).send("Đánh giá không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getReviewById,
  getReviewByRoom,
  createReview,
  deleteReview,
  updateReview,
};
