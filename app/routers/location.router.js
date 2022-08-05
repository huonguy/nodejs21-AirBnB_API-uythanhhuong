const express = require("express");
const {
  getAllLocation,
  getLocationById,
  createLocation,
  deleteLocation,
  updateLocation,
  uploadLocImage,
} = require("../controllers/location.controller");

const { authenticate, authorize } = require("../controllers/auth.controller");
const { uploadImage } = require("../helper/util");

const locationRouter = express.Router();

locationRouter.get("/:_id", getLocationById);
locationRouter.get("/", getAllLocation);
locationRouter.post("/", authenticate, authorize(["ADMIN"]), createLocation);
locationRouter.delete(
  "/:_id",
  authenticate,
  authorize(["ADMIN"]),
  deleteLocation
);
locationRouter.put("/:_id", authenticate, authorize(["ADMIN"]), updateLocation);
locationRouter.post(
  "/upload-images/:_id",
  authenticate,
  authorize(["ADMIN"]),
  uploadImage("uploads/location").single("location"),
  uploadLocImage
);

module.exports = locationRouter;
