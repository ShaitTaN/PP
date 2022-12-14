import React from 'react'
import FormInput from '../../components/FormInput/FormInput'
import { useTelegram } from '../../hooks/useTelegram'
import './serialCodePage.css'

interface SerialCodePageAddProps {
	idToken: string
}

const SerialCodePageAdd: React.FC<SerialCodePageAddProps> = ({idToken}) => {
	const [serialCode, setSerialCode] = React.useState('')
	const [country, setCountry] = React.useState('')
	const [diller, setDiller] = React.useState('')
	const {tg} = useTelegram()

	const onAddSerialCode = React.useCallback(async () => {
		if(!serialCode || !country || !diller) return alert('Заполните все поля!')
		try {
			const res = await fetch('http://localhost:3030/serial-add', {
				method: 'POST',
				headers: {
					AuthToken: idToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ serialCode, country, diller }),
			})
			const data = await res.text()
			if(data === 'ok') alert('Серийный номер добавлен!')
			setSerialCode('')
			setCountry('')
			setDiller('')
		} catch (error) {
			console.log(error)
		}
	}, [serialCode, country, diller, idToken])

	// Подписка на событие нажатия на main телеграм кнопку
	React.useEffect(() => {
		tg.onEvent("mainButtonClicked", onAddSerialCode);
		return () => {
			tg.offEvent("mainButtonClicked", onAddSerialCode);
		};
	}, [tg, onAddSerialCode]);

	// Изменение текста main телеграм кнопки и ее отображение
	React.useEffect(() => {
		tg?.MainButton.setParams({ text: "Добавить" });
		tg?.MainButton.show();
		return () => {
			tg?.MainButton.hide();
		};
	}, [tg.MainButton]);

	// Отключение main телеграм кнопки при незаполненных полях
	React.useEffect(() => {
		if (!serialCode || !country || !diller) {
			tg?.MainButton.disable();
		} else {
			tg?.MainButton.enable();
		}
	}, [tg.MainButton, serialCode, country, diller]);

	return (
		<div className="serialCodePage">
      <h2>Введите данные для добавления серийного номера</h2>
      <div className="serialCodePage__input">
        <FormInput
          placeholder="Серийный номер:"
          value={serialCode}
          onChange={(e) => setSerialCode(e.target.value.trim())}
        />
        <FormInput
          placeholder="Страна:"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <FormInput
          placeholder="Диллер:"
          value={diller}
          onChange={(e) => setDiller(e.target.value)}
        />
      </div>
    </div>
	)
}

export default SerialCodePageAdd