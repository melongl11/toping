/* jshint esversion: 6 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  const notice = sequelize.define('Notice', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    tableName: "Notice"
  });

  return notice;
};
