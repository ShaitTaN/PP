import React from "react";
import FormInput from "../FormInput/FormInput";
import MainButton from "../MainButton/MainButton";
import ChatMessage from "./ChatMessage";
import "./chatModal.css";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

interface ChatModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, setIsOpen }) => {
  const [textMessage, setTextMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      text: "Здравствуйте, у вас есть вопрос?",
      from: "personal",
      to: "",
      date: "now",
    },
  ]);
  const [email, setEmail] = React.useState("");
  const [isChatActive, setIsChatActive] = React.useState(false);
  const [errors, setErrors] = React.useState<any>();

  const onSendEmail = () => {
    const validation = formSchema.safeParse({ email });
    if (!validation.success) {
      const errors = validation.error.format();
      setErrors(errors);
      alert(errors.email?._errors.join(", "));
			return
    }
    setIsChatActive(true);
  };

  const onSendMessage = async () => {
    if (!textMessage) return;
    await setTextMessage("");
    await fetch("http://localhost:3030/message", {
      method: "POST",
      body: JSON.stringify({ text: textMessage, from: email, to: "personal" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const onKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendMessage();
      setTextMessage("");
    }
  };

  const subscribeToChat = async () => {
    try {
      const res = await fetch("http://localhost:3030/message");
      const data = await res.json();
      if (data.to === email || data.from === email) {
        setMessages((prev) => [...prev, data]);
      }
      console.log(data);
      await subscribeToChat();
    } catch (e) {
      setTimeout(subscribeToChat, 500);
    }
  };

  React.useEffect(() => {
    if (isChatActive) subscribeToChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatActive]);

  return (
    <>
      <div
        className={`chatModal__open ${!isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        <img src="/message.png" alt="message-btn" />
      </div>
      <div className={`chatModal ${isOpen ? "active" : ""}`}>
        <div className="chatModal__header">
          <h3>Чат c персоналом</h3>
          <div
            className="chatModal__header-close"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
        {isChatActive ? (
          <div className="chatModal__body">
            <div className="chatModal__body-messages">
              {messages.map((item, index) => (
                <ChatMessage
                  key={index}
                  isMy={item.from === email}
                  message={item.text}
                />
              ))}
            </div>
            <div className="chatModal__body-input">
              <input
                type="text"
                placeholder="Сообщение..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={(e) => onKeyEnter(e)}
              />
              <img src="/send.png" alt="send" onClick={onSendMessage} />
            </div>
          </div>
        ) : (
          <div className="chatModal__form">
            <FormInput
              placeholder="Почта:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MainButton onClick={onSendEmail}>Отправить</MainButton>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatModal;
