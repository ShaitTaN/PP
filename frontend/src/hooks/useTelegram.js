const tg = window.Telegram.WebApp

export const useTelegram = () => {
	const onClose = () => {
		tg.close()
	}
	const user = tg.initDataUnsafe.user
	
	return {
		tg,
		onClose,
		user
	}
}