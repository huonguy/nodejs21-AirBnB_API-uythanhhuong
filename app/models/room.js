const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room', {
    _id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    locationId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'location',
        key: '_id'
      }
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'room',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "_id" },
        ]
      },
      {
        name: "locationId",
        using: "BTREE",
        fields: [
          { name: "locationId" },
        ]
      },
    ]
  });
};
