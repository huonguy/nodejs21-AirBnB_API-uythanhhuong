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

    const existedRoom = await models.room.findOne({
      where: {
        _id: existedTicket.roomId,
      },
    });

    const existedUser = await models.users.findOne({
      where: {
        _id: existedTicket.userId,
      },
    });

    if (existedTicket) {
      res.status(200).send({
        ...existedTicket.dataValues,
        roomId: existedRoom.dataValues,
        userId: existedUser.dataValues,
      });
    } else {
      res.status(404).send("Thông tin đặt phòng không tồn tại!");
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
      res.status(200).send("Thông tin đặt phòng không tồn tại!");
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
      res.status(200).send("Thông tin đặt phòng không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllTicket = async (req, res) => {
  try {
    const tickets = await models.ticket.findAll();

    if (tickets.length != 0) {
      res.status(200).send(tickets);
    } else {
      res.status(200).send("Không có thông tin đặt phòng!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTicket = async (req, res) => {
  const { roomId, checkIn, checkOut, totalPrice } = req.body;
  const userId = req.user._id;

  try {
    const _id = createId();

    const newTicket = await models.ticket.create({
      _id,
      checkIn,
      checkOut,
      totalPrice,
      roomId,
      userId,
      createdDate: Date.now(),
    });

    res.status(201).send({
      message: "Đặt phòng thành công!",
      status_code: 201,
      success: true,
      ticket: newTicket,
    });
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

      res.status(200).send({
        message: "Xóa thông tin đặt phòng thành công!",
        status_code: 200,
        success: true,
      });
    } else {
      res.status(404).send("Thông tin đặt phòng không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateTicket = async (req, res) => {
  const { _id } = req.params;
  const { roomId, checkIn, checkOut, totalPrice } = req.body;

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
      existedTicket.totalPrice = totalPrice;
      existedTicket.createdDate = Date.now();

      await existedTicket.save();

      res.status(200).send({
        message: "Cập nhật thông tin đặt phòng thành công!",
        status_code: 200,
        success: true,
        ticket: existedTicket,
      });
    } else {
      res.status(404).send("Thông tin đặt phòng không tồn tại!");
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
