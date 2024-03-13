// const sequelize = require('./db');
const fs = require('fs')
require("dotenv").config()
// const { UserTg } = require('./models');
const { operateBotFromPlatForm } = require('./utils')

try{
    operateBotFromPlatForm(process.env.platForm, process.env.robotToken, process.env.clientId)
}catch(e){
    console.log(e)
}




// const sendToken = async(chatId, address, isInsertFlag) => {
//     try{
//         sendMsg(chatId, 'Transferring...')
//         // TODO:
//         // await send token by contracts
//         // const txStatus = getTxRs(transactionId)

//         if(isInsertFlag){
//             await insertItem(chatId, address, config.platForm, transactionId, txStatus)
//         }else {
//             if(txStatus === 'mined'){
//                 await updateItem(chatId, address)
//             } 
//         }

//         if(txStatus === 'mined'){
//             sendMsg(chatId, `Sending 1 to ${address}, Please pay attention to check`)
//         } else {
//             sendMsg(chatId, 'Transaction is not mined yet, please try again later')
//         }
//     }catch(e){
//         throw Error('insert or update data fail')
//     }
// }


// const start = async () => {
   
//     try {
//         await sequelize.authenticate()
//         await sequelize.sync()
//     } catch (e) {
//         console.log('sequelize error', e)
//     }

// }

// start()
