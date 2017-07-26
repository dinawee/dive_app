// define dive_operators table and model
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('_prep_divespots', {
        divespot_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        divespot_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        divespot_array: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        region_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            // allowNull: false,
        }
    }, {
            // timestamps: false,
            underscored: true,
            tableName: '_prep_divespots', // to fit .sql table name
        });
};
