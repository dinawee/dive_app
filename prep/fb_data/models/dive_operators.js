// define dive_operators table and model
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('bookmarks', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        batch_id: {
            type: DataTypes.STRING,
            //   allowNull: false,
        },
        fb_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
        },
        divespot_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            // allowNull: false,
        }
    }, {
            // timestamps: false,
            underscored: true,
            tableName: 'user_dive_operators', // to fit .sql table name
        });
};
