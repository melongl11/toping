/* jshint esversion: 6 */
"use strict";

module.exports = function(sequelize, DataTypes) {
  const tier = sequelize.define('Tier', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    tableName: "Tier"
  });

  tier.associate = function (models) {
    tier.hasMany(models.User);
  };

  return tier;
};
