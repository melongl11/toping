/* jshint esversion: 6 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  const admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    tableName: "Admin"
  });

  return admin;
};
