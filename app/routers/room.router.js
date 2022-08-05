const express = require("express");
const {
  createRoom,
  getRoomById,
  getRoomByLocation,
  deleteRoom,
  updateRoom,
  uploadRoomImage,
  reserveRoom,
  getAllRoom,
} = require("../controllers/room.controller");

const { authenticate, authorize } = require("../controllers/auth.controller");
const { uploadImage } = require("../helper/util");

const roomRouter = express.Router();

roomRouter.get("/by-location", getRoomByLocation);
roomRouter.get("/:_id", getRoomById);
roomRouter.get("/", getAllRoom);
roomRouter.post("/", authenticate, authorize(["ADMIN"]), createRoom);
roomRouter.delete("/:_id", authenticate, authorize(["ADMIN"]), deleteRoom);
roomRouter.put("/:_id", authenticate, authorize(["ADMIN"]), updateRoom);
roomRouter.post(
  "/upload-image/:_id",
  authenticate,
  authorize(["ADMIN"]),
  uploadImage("uploads/room").single("room"),
  uploadRoomImage
);
roomRouter.post("/booking", authenticate, reserveRoom);

module.exports = roomRouter;
