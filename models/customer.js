"use strict";

module.exports = function(sequelize, DataTypes) {
    var customer = sequelize.define("customer", {
            idCust:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                notNull: true
            },
            name: {
                type: DataTypes.STRING(100),
                notNull: true
            },
            phone: {
                type:DataTypes.STRING(20),
                notNull: true
            },
            hal: {
                type: DataTypes.STRING(255),
                notNull: true
            },
            smsID: {
                type: DataTypes.INTEGER(10),
                notNull: true
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    customer.hasMany(models.inbox, {
                        foreignKey: "SenderNumber"
                    });
                    customer.hasMany(models.sentitems, {
                        foreignKey: "DestinationNumber"
                    });
                }
            },
            freezeTableName: true,
            createdAt: false,
            timestamps: false,
            tableName:'customer'
        });
    return customer;
};