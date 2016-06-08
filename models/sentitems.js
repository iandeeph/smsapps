"use strict";

module.exports = function(sequelize, DataTypes) {
    var sentitems = sequelize.define("sentitems", {
            ID: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                notNull: true
            },
            SendingDateTime: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                notNull: true
            },
            DestinationNumber: {
                type:DataTypes.STRING(20),
                notNull: true
            },
            TextDecoded: {
                type: DataTypes.TEXT,
                notNull: true
            },
            status: {
                type: DataTypes.ENUM('SendingOK','SendingOKNoReport','SendingError','DeliveryOK','DeliveryFailed','DeliveryPending','DeliveryUnknown','Error'),
                notNull: true
            },
            CreatorID: {
                type: DataTypes.TEXT,
                notNull: true
            },
            sentMessages: {
                type: DataTypes.VIRTUAL
            }
        },
        {
            classMethods: {
                associate: function(models) {
                    sentitems.belongsTo(models.customer, {
                        foreignKey: "DestinationNumber",
                        targetKey: "phone",
                        onDelete: "CASCADE"
                    });
                }
            },
            freezeTableName: true,
            createdAt: false,
            timestamps: false,
            tableName:'sentitems'
        });

    return sentitems;
};