const {Sequelize} = require('sequelize');
require("dotenv").config()
const {MYSQL_DB_NAME,MYSQL_USERNAME,MYSQL_PASSWORD,MYSQL_HOST,MYSQL_PORT} = process.env;
module.exports = new Sequelize(
    MYSQL_DB_NAME,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    {
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    }
)
