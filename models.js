const sequelize = require('./db');
const {DataTypes} = require('sequelize');

//id, address, chat_id, chat_platform, tx_id, status(mined...), tx_date
const UserTg = sequelize.define('telegram_txs', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    address: {type: DataTypes.STRING},
    chat_id: {type: DataTypes.INTEGER},
    chat_platform: {type: DataTypes.STRING},
    tx_id: {type: DataTypes.INTEGER},
    status: {type: DataTypes.STRING},
    tx_date: {type: DataTypes.DATE},
})
module.exports = { UserTg };
