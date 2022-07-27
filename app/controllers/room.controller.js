const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const { createId } = require("../helper/util");

const getRoomById = async (req, res) => {
  const { _id } = req.params;
  try {
    const room = await models.room.findOne({
      where: {
        _id,
      },
    });

    const roomDetail = await models.room_detail.findOne({
      where: {
        roomId: _id,
      },
    });

    if (room) {
      res.status(200).send({
        ...room.dataValues,
        ...roomDetail.dataValues,
      });
    } else {
      res.status(404).send("Room Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRoomByLocation = async (req, res) => {
  const { locationId } = req.query;

  try {
    const locations = await models.room.findAll({
      where: {
        locationId,
      },
    });

    if (locations.length != 0) {
      res.status(200).send(locations);
    } else {
      res.status(404).send("Location Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const createRoom = async (req, res) => {
  const {
    name,
    description,
    price,
    locationId,
    guests,
    bedRoom,
    bath,
    elevator,
    hotTub,
    pool,
    indoorFireplace,
    dryer,
    gym,
    kitchen,
    wifi,
    heating,
    cableTV,
  } = req.body;

  try {
    const _id = createId();

    const newRoom = await models.room.create({
      _id,
      name,
      description,
      price,
      locationId,
    });

    const newRoomDetail = await models.room_detail.create({
      roomId: _id,
      guests,
      bedRoom,
      bath,
      elevator,
      hotTub,
      pool,
      indoorFireplace,
      dryer,
      gym,
      kitchen,
      wifi,
      heating,
      cableTV,
    });

    res
      .status(201)
      .send({ ...newRoom.dataValues, ...newRoomDetail.dataValues });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteRoom = async (req, res) => {
  const { _id } = req.params;

  try {
    const existedRoom = await models.room.findOne({
      where: {
        _id,
      },
    });

    const existedRoomDetail = await models.room_detail.findOne({
      where: {
        roomId: _id,
      },
    });

    if (existedRoom) {
      models.room_detail.destroy({
        where: {
          roomId: _id,
        },
      });

      models.room.destroy({
        where: {
          _id,
        },
      });

      res.status(200).send({
        ...existedRoom.dataValues,
        ...existedRoomDetail.dataValues,
      });
    } else {
      res.status(404).send("Room Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateRoom = async (req, res) => {
  const { _id } = req.params;
  const {
    name,
    description,
    price,
    locationId,
    guests,
    bedRoom,
    bath,
    elevator,
    hotTub,
    pool,
    indoorFireplace,
    dryer,
    gym,
    kitchen,
    wifi,
    heating,
    cableTV,
  } = req.body;

  try {
    let existedRoom = await models.room.findOne({
      where: {
        _id,
      },
    });

    let existedRoomDetail = await models.room_detail.findOne({
      where: {
        roomId: _id,
      },
    });

    if (existedRoom) {
      existedRoom.name = name;
      existedRoom.description = description;
      existedRoom.price = price;
      existedRoom.locationId = locationId;

      existedRoomDetail.guests = guests;
      existedRoomDetail.bedRoom = bedRoom;
      existedRoomDetail.bath = bath;
      existedRoomDetail.elevator = elevator;
      existedRoomDetail.hotTub = hotTub;
      existedRoom.pool = pool;
      existedRoomDetail.indoorFireplace = indoorFireplace;
      existedRoomDetail.dryer = dryer;
      existedRoomDetail.gym = gym;
      existedRoomDetail.kitchen = kitchen;
      existedRoomDetail.wifi = wifi;
      existedRoomDetail.heating = heating;
      existedRoomDetail.cableTV = cableTV;

      await existedRoom.save();
      await existedRoomDetail.save();

      res
        .status(200)
        .send({ ...existedRoom.dataValues, ...existedRoomDetail.dataValues });
    } else {
      res.status(404).send("Room Not Found!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const uploadRoomImage = async (req, res) => {
  const { _id } = req.params;
  const room = req.file.path;

  try {
    if (!req.file) {
      res.status(404).send("No File Uploaded!");
    } else {
      let existedRoom = await models.room.findOne({
        where: {
          _id,
        },
      });

      let existedRoomDetail = await models.room_detail.findOne({
        where: {
          roomId: _id,
        },
      });

      if (existedRoom) {
        existedRoom.image = room;

        await existedRoom.save();
        res
          .status(200)
          .send({ ...existedRoom.dataValues, ...existedRoomDetail.dataValues });
      } else {
        res.status(404).send("Room Not Found!");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const reserveRoom = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  const userId = req.user._id;

  try {
    const _id = createId();

    await models.ticket.create({
      _id,
      checkIn,
      checkOut,
      roomId,
      userId,
    });

    const tickets = await models.ticket.findAll({
      where: {
        userId,
      },
      order: [["createdDate", "ASC"]],
    });

    res.status(201).send({
      message: "You successfully created your booking!",
      userDetail: {
        tickets: tickets.map((ticket) => {
          return ticket.dataValues._id;
        }),
        ...req.user,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getRoomById,
  getRoomByLocation,
  createRoom,
  deleteRoom,
  updateRoom,
  uploadRoomImage,
  reserveRoom,
};
