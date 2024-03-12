const TelegramApi = require('node-telegram-bot-api')
const { Bot }= require('discot')
const { UserTg } = require('./models');

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

const operateBotFromPlatForm = (platForm, token, callback) => {
    let robot = {}
    console.log(platForm,token)
    switch(platForm){
        case 'telegram':
            robot = new TelegramApi(token, {polling: true})
            robot.onText(/\!faucet cat (.+)/, async(msg, match) => {
    
                const chatId = msg.chat.id;
                const address = match[1];
        
                // const users = await UserTg.findAll({
                //     where: {
                //         chat_id: chatId,
                //         address: address
                //     }
                // });
        
                // if(!users || users.length === 0){
                //     sendToken(chatId, address, true)
                // } else if(users[0].status !== 'mined') {
                //     sendToken(chatId, address, false)
                // } else {
                //     sendMsg(chatId, 'This address has already received test coins and cannot receive them anymore.');
                // }
                callback && callback(address)
            });
            break;
        case 'discord':
            robot = new Bot({
                token, 
                prefix: '!'
            });
            robot.addCommand({
                name: 'faucet cat',
                description: 'get 1 SGR-1 token from robot',
                action: message => {
                    message.channel.send('pong')
                    callback && callback(address)
                }
            })
            .start(() => console.log('robot started.'));
            break;
        default:
            throw Error('do not support this platForm')
    }
}


module.exports = { insertItem, updateItem, operateBotFromPlatForm };