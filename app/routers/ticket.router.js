const express = require("express");
const {
  getTicketById,
  createTicket,
  deleteTicket,
  updateTicket,
  getAllTicket,
  getTicketByRoom,
  getTicketByUser,
} = require("../controllers/ticket.controller");

const { authenticate, authorize } = require("../controllers/auth.controller");

const ticketRouter = express.Router();

ticketRouter.get("/by-room", getTicketByRoom);
ticketRouter.get("/by-user", getTicketByUser);
ticketRouter.get("/:_id", getTicketById);
ticketRouter.get("/", getAllTicket);
ticketRouter.post("/", authenticate, authorize(["ADMIN"]), createTicket);
ticketRouter.delete("/:_id", authenticate, authorize(["ADMIN"]), deleteTicket);
ticketRouter.put("/:_id", authenticate, authorize(["ADMIN"]), updateTicket);

module.exports = ticketRouter;
