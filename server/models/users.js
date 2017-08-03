// define users table and model
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        fb_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'fb_id', // we set unique to a string instead of true due to a bug : https://github.com/sequelize/sequelize/issues/6134
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        access_token: {
            type: DataTypes.STRING
        },
    }, {
            // timestamps: false,
            underscored: true,
            tableName: 'users', // to fit .sql table name
        });
};
