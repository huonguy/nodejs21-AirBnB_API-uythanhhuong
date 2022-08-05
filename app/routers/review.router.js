const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
  getReviewByRoom,
  getReviewByUserId,
} = require("../controllers/review.controller");

const { authenticate, authorize } = require("../controllers/auth.controller");

const reviewRouter = express.Router();
reviewRouter.get("/by-room", getReviewByRoom);
reviewRouter.get("/:_id", getReviewById);
reviewRouter.post("/", authenticate, createReview);
reviewRouter.delete("/:_id", authenticate, deleteReview);
reviewRouter.put("/:_id", authenticate, updateReview);

module.exports = reviewRouter;
