const tg = window.Telegram.WebApp || null

export const useTelegram = () => {
	const user = tg.initDataUnsafe.user
	
	const onClose = () => {
		tg.close()
	}

	const showButton = () => {
		tg.MainButton.show()
	}

	const hideButton = () => {
		tg.MainButton.hide()
	}
	
	return {
		tg,
		onClose,
		showButton,
		hideButton,
		user
	}
}