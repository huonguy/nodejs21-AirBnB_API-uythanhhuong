const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const { createId } = require("../helper/util");

const getTicketById = async (req, res) => {
  const { _id } = req.params;

  try {
    const existedTicket = await models.ticket.findOne({
      where: {
        _id,
      },
    });

    if (existedTicket) {
      res.status(200).send(existedTicket);
    } else {
      res.status(404).send("Ticket Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketByUser = async (req, res) => {
  const { userId } = req.query;

  try {
    const tickets = await models.ticket.findAll({
      where: {
        userId,
      },
    });

    if (tickets.length != 0) {
      res.status(200).send(tickets);
    } else {
      res.status(200).send("Ticket Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketByRoom = async (req, res) => {
  const { roomId } = req.query;
  console.log(roomId);

  try {
    const tickets = await models.ticket.findAll({
      where: {
        roomId,
      },
    });

    if (tickets.length != 0) {
      res.status(200).send(tickets);
    } else {
      res.status(200).send("Ticket Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllTicket = async (req, res) => {
  try {
    const tickets = await models.ticket.findAll();

    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTicket = async (req, res) => {
  const { checkIn, checkOut, roomId } = req.body;
  const userId = req.user._id;

  try {
    const _id = createId();

    const newTicket = await models.ticket.create({
      _id,
      checkIn,
      checkOut,
      roomId,
      userId,
    });

    res.status(201).send(newTicket);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteTicket = async (req, res) => {
  const { _id } = req.params;

  try {
    const existedTicket = await models.ticket.findOne({
      where: {
        _id,
      },
    });

    if (existedTicket) {
      models.ticket.destroy({
        where: {
          _id,
        },
      });

      res.status(200).send(existedTicket);
    } else {
      res.status(404).send("Ticket Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateTicket = async (req, res) => {
  const { _id } = req.params;
  const { checkIn, checkOut, roomId } = req.body;

  try {
    let existedTicket = await models.ticket.findOne({
      where: {
        _id,
      },
    });

    if (existedTicket) {
      existedTicket.checkIn = checkIn;
      existedTicket.checkOut = checkOut;
      existedTicket.roomId = roomId;

      await existedTicket.save();

      res.status(200).send(existedTicket);
    } else {
      res.status(404).send("Ticket Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getTicketById,
  getTicketByUser,
  getTicketByRoom,
  getAllTicket,
  createTicket,
  deleteTicket,
  updateTicket,
};
