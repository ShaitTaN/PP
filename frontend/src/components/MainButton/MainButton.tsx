import React, { FC } from 'react'
import './mainButton.css'

interface MainButtonProps {
	children: React.ReactNode,
	onClick?: () => void,
}

const MainButton: FC<MainButtonProps> = ({children, onClick}) => {
	return (
		<button onClick={onClick} className='mainButton'>{children}</button>
	)
}

export default MainButton