// define users table and model
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('bookmarks', {
        user_dive_operator_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        dive_operator_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
        }
    }, {
            // timestamps: false,
            underscored: true,
            tableName: 'user_dive_operators', // to fit .sql table name
        });
};
