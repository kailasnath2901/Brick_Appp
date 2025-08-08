    'use strict';
    const { Model } = require('sequelize');

    module.exports = (sequelize, DataTypes) => {
    class BrickProduction extends Model {
        static associate(models) {
        BrickProduction.belongsTo(models.BrickType, {
            foreignKey: 'brickTypeId',
            as: 'brickType',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        }
    }

    BrickProduction.init({
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        },
        brickTypeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'BrickTypes',
            key: 'id',
        },
        },
        quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
        productionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        },
        createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        },
        updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'BrickProduction',
        tableName: 'BrickProductions',
        timestamps: true,
    });

    return BrickProduction;
    };
