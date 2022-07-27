const express = require("express");
const locationRouter = require("./location.router");
const reviewRouter = require("./review.router");
const roomRouter = require("./room.router");
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const ticketRouter = require("./ticket.router");

const rootRouter = express.Router();
rootRouter.use("/users", userRouter);
rootRouter.use("/locations", locationRouter);
rootRouter.use("/rooms", roomRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/reviews", reviewRouter);
rootRouter.use("/tickets", ticketRouter);

module.exports = rootRouter;
