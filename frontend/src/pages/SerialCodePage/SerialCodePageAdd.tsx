import React from 'react'
import FormInput from '../../components/FormInput/FormInput'
import MainButton from '../../components/MainButton/MainButton'
import './serialCodePage.css'

interface SerialCodePageAddProps {
	idToken: string
}

const SerialCodePageAdd: React.FC<SerialCodePageAddProps> = ({idToken}) => {
	const [serialCode, setSerialCode] = React.useState('')
	const [country, setCountry] = React.useState('')
	const [diller, setDiller] = React.useState('')

	const onAddSerialCode = async () => {
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
	}

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
        <MainButton onClick={onAddSerialCode}>Добавить</MainButton>
      </div>
    </div>
	)
}

export default SerialCodePageAdd