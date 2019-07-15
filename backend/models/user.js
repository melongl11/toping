/* jshint esversion: 6 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  const user = sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/g
      }
    },
    tier: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    tableName: "user"
  });

  user.associate = function(models) {
    user.hasMany(models.Qna);
    user.hasMany(models.Save);
  };
  return user;
};
