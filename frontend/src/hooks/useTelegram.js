const tg = window.Telegram.WebApp || null

export const useTelegram = () => {
	const user = tg.initDataUnsafe.user
	
	const onClose = () => {
		tg.close()
	}
	
	return {
		tg,
		onClose,
		user
	}
}