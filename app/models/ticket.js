const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticket', {
    _id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    roomId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'room',
        key: '_id'
      }
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'users',
        key: '_id'
      }
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'ticket',
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
        name: "roomId",
        using: "BTREE",
        fields: [
          { name: "roomId" },
        ]
      },
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
