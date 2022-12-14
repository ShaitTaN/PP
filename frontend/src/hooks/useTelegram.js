const tg = window.Telegram.WebApp || null

export const useTelegram = () => {
	const user = tg.initDataUnsafe.user
	const queryId = tg.initDataUnsafe.query_id
	const onClose = () => {
		tg.close()
	}
	
	return {
		tg,
		onClose,
		user,
		queryId
	}
}