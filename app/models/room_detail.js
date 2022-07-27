const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room_detail', {
    roomId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'room',
        key: '_id'
      }
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bedRoom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bath: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    elevator: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hotTub: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    pool: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    indoorFireplace: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    dryer: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    gym: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    kitchen: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    wifi: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    heating: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    cableTV: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'room_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roomId" },
        ]
      },
    ]
  });
};
