"use strict";

module.exports = function(sequelize, DataTypes) {
    var log = sequelize.define("log", {
            idLog: {
                type: DataTypes.INTEGER(6).UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                notNull: true
            },
            user: {
                type: DataTypes.STRING(255),
                notNull: true
            },
            action: {
                type: DataTypes.STRING(255),
                notNull: true
            },
            date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                notNull: true
            },
            messageID: {
                type:DataTypes.INTEGER(6)
            },
            phone: {
                type: DataTypes.STRING(20)
            },
            name: {
                type: DataTypes.STRING(20)
            },
            hal: {
                type: DataTypes.STRING(50)
            },
            message: {
                type: DataTypes.TEXT
            }
        },
        {
            freezeTableName: true,
            createdAt: false,
            timestamps: false,
            tableName:'log'
        });

    return log;
};