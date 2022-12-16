import React from 'react'
import ChatMessage from './ChatMessage'
import './chatModal.css'

interface ChatModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({isOpen, setIsOpen}) => {

	const onCloseChat = () => {
		setIsOpen(false);
	}

	const onOpenChat = () => {
		setIsOpen(true);
	}

	return (
		<>
		<div className={`chatModal__open ${!isOpen ? 'active' : ''}`} onClick={onOpenChat} ><img src="/message.png" alt='message-btn'/></div>
		<div className={`chatModal ${isOpen ? 'active' : ''}`}>
			<div className='chatModal__header'>
				<h3>Чат c персоналом</h3>
				<div className="chatModal__header-close" onClick={onCloseChat}></div>
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
		</>
	)
}

export default ChatModal