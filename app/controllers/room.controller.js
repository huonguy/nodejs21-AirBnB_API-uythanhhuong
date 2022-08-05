const sequelize = require("../config/db_connect");
const initModels = require("../models/init-models");
var models = initModels(sequelize);

const path = require("path");

const { createId } = require("../helper/util");

const getAllRoom = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM room r
          JOIN room_detail rd ON r._id = rd.roomId`
    );

    if (results.length != 0) res.status(200).send(results);
    else res.status(200).send("Không có thông tin phòng!");
  } catch (error) {
    res.status(500).send(error);
  }
};

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

    const location = await models.location.findOne({
      where: {
        _id: room.locationId,
      },
    });

    const province = await models.province.findOne({
      where: {
        _id: location.provinceId,
      },
    });

    if (room) {
      const { roomId, ...rDetailRest } = roomDetail.dataValues;

      const result = {
        ...room.dataValues,
        ...rDetailRest,
        location: location.name,
        province: province.name,
      };

      res.status(200).send(result);
    } else {
      res.status(404).send("Phòng không tồn tại!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRoomByLocation = async (req, res) => {
  const { locationId } = req.query;

  try {
    const rooms = await models.room.findAll({
      where: {
        locationId,
      },
    });

    const location = await models.location.findOne({
      where: {
        _id: locationId,
      },
    });

    const province = await models.province.findOne({
      where: {
        _id: location.provinceId,
      },
    });

    if (rooms.length != 0) {
      const result = {
        rooms: [...rooms],
        location: location.name,
        province: province.name,
      };

      res.status(200).send(result);
    } else {
      res.status(404).send("Phòng không tồn tại!");
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
    valueate,
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
      valueate,
      createdDate: Date.now(),
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

    const { image, ...rRest } = newRoom.dataValues;
    const { roomId, ...rDetailRest } = newRoomDetail.dataValues;

    const result = {
      ...rRest,
      ...rDetailRest,
    };

    res.status(201).send({
      message: "Tạo phòng thành công!",
      status_code: 201,
      success: true,
      room: result,
    });
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

    await models.room_detail.findOne({
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
        message: "Xóa phòng thành công!",
        status_code: 200,
        success: true,
      });
    } else {
      res.status(404).send("Phòng không tồn tại!");
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
    valueate,
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
      existedRoom.valueate = valueate;
      existedRoom.createdDate = Date.now();

      existedRoomDetail.guests = guests;
      existedRoomDetail.bedRoom = bedRoom;
      existedRoomDetail.bath = bath;
      existedRoomDetail.elevator = elevator;
      existedRoomDetail.hotTub = hotTub;
      existedRoomDetail.pool = pool;
      existedRoomDetail.indoorFireplace = indoorFireplace;
      existedRoomDetail.dryer = dryer;
      existedRoomDetail.gym = gym;
      existedRoomDetail.kitchen = kitchen;
      existedRoomDetail.wifi = wifi;
      existedRoomDetail.heating = heating;
      existedRoomDetail.cableTV = cableTV;

      await existedRoom.save();
      await existedRoomDetail.save();

      const { roomId, ...rDetailRest } = existedRoomDetail.dataValues;

      const result = {
        ...existedRoom.dataValues,
        ...rDetailRest,
      };

      res.status(200).send({
        message: "Cập nhật phòng thành công!",
        status_code: 200,
        success: true,
        room: result,
      });
    } else {
      res.status(404).send("Phòng không tồn tại!");
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
      res.status(404).send("Chưa chọn hình ảnh!");
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
        existedRoom.createdDate = Date.now();
        existedRoom.image =
          req.protocol +
          "://" +
          path.join(req.headers.host, room).replace(/\\/g, "/");

        await existedRoom.save();

        const { roomId, ...rDetailRest } = existedRoomDetail.dataValues;

        const result = {
          ...existedRoom.dataValues,
          ...rDetailRest,
        };

        res.status(200).send({
          message: "Cập nhật ảnh phòng thành công!",
          status_code: 200,
          success: true,
          room: result,
        });
      } else {
        res.status(404).send("Phòng không tồn tại!");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const reserveRoom = async (req, res) => {
  const { roomId, checkIn, checkOut, totalPrice } = req.body;
  const userId = req.user._id;

  try {
    const _id = createId();

    await models.ticket.create({
      _id,
      checkIn,
      checkOut,
      totalPrice,
      roomId,
      userId,
      createdDate: Date.now(),
    });

    const tickets = await models.ticket.findAll({
      where: {
        userId,
      },
      order: [["createdDate", "ASC"]],
    });

    res.status(201).send({
      message: "Bạn đã đặt phòng thành công!",
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
  getAllRoom,
  createRoom,
  deleteRoom,
  updateRoom,
  uploadRoomImage,
  reserveRoom,
};
