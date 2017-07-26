// define dive_operators table and model
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('_prep_dive_regions', {
        region_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        region_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        region_array: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
            // timestamps: false,
            underscored: true,
            tableName: '_prep_dive_regions', // to fit .sql table name
        });
};
