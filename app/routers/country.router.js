const express = require("express");
const { getAllCountry } = require("../controllers/country.controller");

const countryRouter = express.Router();

countryRouter.get("/", getAllCountry);

module.exports = countryRouter;
