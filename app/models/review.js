const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review', {
    _id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'users',
        key: '_id'
      }
    },
    roomId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'room',
        key: '_id'
      }
    }
  }, {
    sequelize,
    tableName: 'review',
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
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "roomId",
        using: "BTREE",
        fields: [
          { name: "roomId" },
        ]
      },
    ]
  });
};
