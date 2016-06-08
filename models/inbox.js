"use strict";

module.exports = function(sequelize, DataTypes) {
    var inbox = sequelize.define("inbox", {
        ID: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            notNull: true
        },
        ReceivingDateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            notNull: true
        },
        SenderNumber: {
            type:DataTypes.STRING(20),
            notNull: true
        },
        TextDecoded: {
            type: DataTypes.TEXT,
            notNull: true
        }
    },
    {
        classMethods: {
            associate: function(models) {
                inbox.belongsTo(models.customer, {
                    foreignKey: "SenderNumber",
                    targetKey: "phone",
                    onDelete: "CASCADE"
                });
            }
        },
        freezeTableName: true,
        createdAt: false,
        timestamps: false,
        tableName:'inbox'
    });

    return inbox;
};