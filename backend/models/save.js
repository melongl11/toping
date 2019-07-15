/* jshint esversion: 6 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  const save = sequelize.define('Save', {
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
    mdkey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    json: {
      type: DataTypes.BLOB,
      allowNull: false,
      get() {
        return this.getDataValue('json').toString('utf8');
      },
    },
    metadata: {
      type:DataTypes.BLOB,
      allowNull:false,
      get() {
        return this.getDataValue('metadata').toString('utf8');
      },
    }
  });
  save.associate = function(models) {
    save.belongsTo(models.User);
  };
  return save;
};
