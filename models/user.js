"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        idUser: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            notNull: true
        },
        username: {
            type: DataTypes.STRING,
            notNull: true
        },
        privilege: {
            type:DataTypes.INTEGER(2),
            defaultValue: '1',
            notNull: true
        },
        name: {
            type: DataTypes.STRING(45),
            notNull: true
        },
        password: {
            type: DataTypes.STRING(30),
            notNull: true
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
        tableName:'user'
    });

    return user;
};