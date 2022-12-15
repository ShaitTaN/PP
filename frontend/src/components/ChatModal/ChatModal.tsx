import React from 'react'
import ChatMessage from './ChatMessage'
import './chatModal.css'

const ChatModal = () => {
	return (
		<div className='chatModal'>
			<div className='chatModal__header'>
				<h3>Чат c персоналом</h3>
				<div className="chatModal__header-close"></div>
			</div>
			<div className='chatModal__body'>
				<div className="chatModal__body-messages">
					<ChatMessage isMy={false} message='messagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessage' />
					<ChatMessage isMy={true} message='message' />
					<ChatMessage isMy={false} message='messagemessagessagemessagemessagemessagemessagemessagemessage' />
				</div>
				<div className="chatModal__body-input">
					<input type="text" placeholder='Сообщение...' />
				</div>
			</div>
		</div>
	)
}

export default ChatModal