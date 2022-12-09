import TelegramBot from 'node-telegram-bot-api'
import {db} from './firebase'

const token = '5720047994:AAEJpGg3e9jmV1nBc2_tQEoFPNHW2vfSwL0'
const bot = new TelegramBot(token, {polling: true})
const webAppUrl = 'https://remarkable-crostata-72b9ae.netlify.app'

bot.on('message', async (msg) => {
	const chatId = msg.chat.id
	const text = msg.text
	
	if(text === '/start'){
		await bot.sendMessage(chatId, 'Ниже появится форма для авторизации', {
			reply_markup: {
				inline_keyboard: [
					[{text: 'Заполнить форму', web_app: {url: webAppUrl + '/auth'}}]
				]
			}
		})
	}
})