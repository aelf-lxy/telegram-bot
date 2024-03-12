const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const fs = require('fs')
require("dotenv").config()
const {jobLocationsOptions, applyJob, jobOptions} = require('./options')
const {UserTg , JobLocations} = require('./models');
const getTxRs = require('./getTxResult');
const {TELEGRAM_API_TOKEN} = process.env;
const config = JSON.parse(fs.readFileSync(`./config.json`))
const token =  TELEGRAM_API_TOKEN

const bot = new TelegramApi(token, {polling: true})

const insertItem = async(chatId, address, platForm, txId, txStatus) => {
    try{
        await UserTg.create({
            id: null,
            address: address,
            chat_id: chatId,
            chat_platform: platForm,
            tx_id: txId,
            status: txStatus,
            tx_date: Date.now()
        })
    }catch(e){
        throw Error('insert data fail')
    }
}

const updateItem = async(chatId, address) => {
    try{
        await UserTg.update({status: 'mined'}, {
            where: {
                chat_id: chatId,
                address: address
            }
        });
    }catch(e){
        throw Error('update data fail')
    }
}

const sendToken = async(chatId, address, isInsertFlag) => {
    try{
        // TODO:
        // await send token by contracts
        // const txStatus = getTxRs(transactionId)

        if(isInsertFlag){
            await insertItem(chatId, address, 'telegram', transactionId, txStatus)
        }else {
            if(txStatus === 'mined'){
                await updateItem(chatId, address)
            } 
        }

        if(txStatus === 'mined'){
            bot.sendMessage(chatId, 'Transaction is successful')
        } else {
            bot.sendMessage(chatId, 'Transaction is not mined yet, please try again later')
        }
    }catch(e){
        throw Error('insert or update data fail')
    }
}


const start = async () => {
   
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('sequelize error', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'xxx'}
    ])

    // Matches "/#Test Token# [address]"
    bot.onText(/\#Test Token\# (.+)/, async(msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        console.log('xxxxxxxx', msg)
    
        const chatId = msg.chat.id;
        const address = match[1]; // the captured "address"

        const users = await UserTg.findAll({
            where: {
                chat_id: chatId,
                address: address
            }
        });

        if(!users || users.length === 0){
            sendToken(chatId, address, true)
        } else if(users[0].status !== 'mined') {
            sendToken(chatId, address, false)
        } else {
            bot.sendMessage(chatId, 'already');
        }




    
        // send back the matched "address" to the chat
        bot.sendMessage(chatId, address);
    });

}

start()
