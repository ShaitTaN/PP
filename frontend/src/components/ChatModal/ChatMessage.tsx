import React from 'react'
import './chatMessage.css'

interface ChatMessageProps {
	message: string;
	isMy: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({message, isMy}) => {
	return (
		<div className={`chatMessage ${isMy ? 'my' : ''}`}><p>{message}</p></div>
	)
}

export default ChatMessage