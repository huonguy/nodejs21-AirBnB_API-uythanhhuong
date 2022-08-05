const express = require("express");
const { getAllProvince } = require("../controllers/province.controller");

const provinceRouter = express.Router();

provinceRouter.get("/", getAllProvince);

module.exports = provinceRouter;
