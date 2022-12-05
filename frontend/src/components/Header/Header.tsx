import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
	return (
		<div className='header'>
			<Link to={'/'}>Главная</Link>
			<Link to={'/auth'}>Авторизация</Link>
		</div>
	)
}

export default Header