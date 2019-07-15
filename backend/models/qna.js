/* jshint esversion: 6 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  const qna = sequelize.define('Qna', {
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
    inqeuiry: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    answer: {
      type:DataTypes.TEXT,
    }
  }, {
    freezeTableName: true,
    tableName: "Qna"
  });
  qna.associate = function(models) {
    qna.belongsTo(models.User);
  };
  return qna;
};
