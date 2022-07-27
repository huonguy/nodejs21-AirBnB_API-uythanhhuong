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

    if (review) {
      res.status(200).send(review);
    } else {
      res.status(200).send("Review Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReviewByRoom = async (req, res) => {
  const { roomId } = req.query;

  try {
    const reviews = await models.review.findAll({
      where: {
        roomId,
      },
    });

    if (reviews.length != 0) {
      res.status(200).send(reviews);
    } else {
      res.status(200).send("Review Not Found!");
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
    });
    res.status(200).send(newReview);
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
      res.status(200).send(existedReview);
    } else {
      res.status(200).send("Review Not Found!");
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

    if (existedReview) {
      existedReview.content = content;
      await existedReview.save();
    } else {
      res.status(200).send("Review Not Found!");
    }

    res.status(200).send(existedReview);
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
