"use strict";

module.exports = function(sequelize, DataTypes) {
    var outbox_multipart = sequelize.define("outbox_multipart", {
            ID: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                notNull: true
            },
            TextDecoded: {
                type: DataTypes.TEXT,
                notNull: true
            },
            SequencePosition: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                notNull: true
            }
        },
        {
            classMethods: {
                associate: function(models) {
                    outbox_multipart.belongsTo(models.outbox, {
                        foreignKey: "ID",
                        targetKey: "ID",
                        onDelete: "CASCADE"
                    });
                }
            },
            freezeTableName: true,
            createdAt: false,
            timestamps: false,
            tableName:'outbox_multipart'
        });

    return outbox_multipart;
};