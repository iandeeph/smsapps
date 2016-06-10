"use strict";

module.exports = function(sequelize, DataTypes) {
    var outbox = sequelize.define("outbox", {
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
            MultiPart: {
                type: DataTypes.ENUM('false','true')
            },
            CreatorID: {
                type: DataTypes.TEXT,
                notNull: true
            }
        },
        {
            classMethods: {
                associate: function(models) {
                    outbox.hasMany(models.outbox_multipart, {
                        foreignKey: "ID"
                    });
                    outbox.belongsTo(models.customer, {
                        foreignKey: "DestinationNumber",
                        targetKey: "phone"
                    });
                }
            },
            freezeTableName: true,
            createdAt: false,
            timestamps: false,
            tableName:'outbox'
        });

    return outbox;
};