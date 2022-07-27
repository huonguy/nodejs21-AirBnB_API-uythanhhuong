const express = require("express");
const {
  getAllUser,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  uploadAvatar,
} = require("../controllers/user.controller");

const { authenticate, authorize } = require("../controllers/auth.controller");
const { uploadImage } = require("../helper/util");

const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.get("/:_id", getUserById);
userRouter.post("/", authenticate, authorize(["ADMIN"]), createUser);
userRouter.delete("/:_id", authenticate, authorize(["ADMIN"]), deleteUser);
userRouter.put("/:_id", authenticate, updateUser);
userRouter.post(
  "/upload-avatar",
  authenticate,
  uploadImage("uploads/avatar").single("avatar"),
  uploadAvatar
);

module.exports = userRouter;
