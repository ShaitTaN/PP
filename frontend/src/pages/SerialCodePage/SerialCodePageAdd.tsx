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
		try {
			tg.sendData(JSON.stringify({ idToken, serialCode, country, diller, msg: 'add_serial_code' }));
			setSerialCode('')
			setCountry('')
			setDiller('')
		} catch (error) {
			console.log(error)
		}
	}, [idToken, serialCode, country, diller, tg])

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