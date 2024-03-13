const TelegramApi = require('node-telegram-bot-api')
const { Client, Collection, Events, GatewayIntentBits, userMention } = require('discord.js');
const { UserTg } = require('./models');
const getTxRs = require('./getTxResult');

const { faucetsToken } = require('./api');


const sendToken = async (address, callBack) => {
  try {
    const originRes = await faucetsToken({
      address: address
    })
    const res = originRes.data;
    if (res.code === '20000') {
      callBack({
        status: 'pending'
      })
      const transactionId = res.data.transactionId
      try {
        await getTxRs(transactionId)
        callBack({
          status: 'success',
          data: res.data
        })
      } catch (error) {
        callBack({
          status: 'error',
          message: error
        })
      }
    } else {
      callBack({
        status: 'error',
        message: res.message
      })
    }
  } catch (error) {
    callBack({
      status: 'error',
      message: error
    })
  }

}

const insertItem = async (chatId, address, platForm, txId, txStatus) => {
  try {
    await UserTg.create({
      id: null,
      address: address,
      chat_id: chatId,
      chat_platform: platForm,
      tx_id: txId,
      status: txStatus,
      tx_date: Date.now()
    })
  } catch (e) {
    throw Error('insert data fail')
  }
}

const updateItem = async (chatId, address) => {
  try {
    await UserTg.update({ status: 'mined' }, {
      where: {
        chat_id: chatId,
        address: address
      }
    });
  } catch (e) {
    throw Error('update data fail')
  }
}
const prefix = `!faucet cat`;

const operateBotFromPlatForm = (platForm, token, clientId) => {
  let robot = {}
  console.log(platForm, token)
  switch (platForm) {
    case 'telegram':
      robot = new TelegramApi(token, { polling: true })
      robot.onText(/\!faucet cat (.+)/, async (msg, match) => {

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
      });
      break;
    case 'discord':
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
        ],
      });
      client.on(Events.MessageCreate, async (interaction) => {
        const content = interaction.content.trim();
        if (!content.startsWith(prefix) || interaction.author.id === clientId) return;
        const address = content.split(prefix)[1].trim().replace(/^ELF_/, '').replace(/_.*$/, '');
        // readyClient
        const id = interaction.author.id;
        const user = userMention(id);
        console.log(`|${address}|`)
        sendToken(address, (res) => {
          const { status, message } = res;
          if (status === 'success') {
            const { amount, symbol, address } = res.data;
            interaction.reply(`${user}，sending ${amount} ${symbol} token to ${address}`);
          } else if (status === 'error') {
            interaction.reply(`${user}，${message}`);
          }
        })

      });
      client.login(token).then(() => {
        console.log('success login')
      })


      break;
    default:
      throw Error('do not support this platForm')
  }
}


module.exports = { insertItem, updateItem, operateBotFromPlatForm };