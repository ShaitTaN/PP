import { User } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import MainButton from "../../components/MainButton/MainButton";
import "./serialCodePage.css";

interface SerialCodePageProps {
  authUser: User | null;
}

interface SerialCode {
  code: string;
  country: string;
  diller: string;
  date: string;
}

const SerialCodePage: React.FC<SerialCodePageProps> = ({ authUser }) => {
  const [serialCode, setSerialCode] = React.useState("");
  const [data, setData] = React.useState<SerialCode | null>(null);

  const onSendSerialCode = () => {
    fetch("http://localhost:3030/serial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serialCode, authUser }),
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  };

  return (
    <div className="serialCodePage">
      <h2>Введите ваш серийный номер для проверки</h2>
      <div className="serialCodePage__input">
        <FormInput
          placeholder="Серийный номер:"
          value={serialCode}
          onChange={(e) => setSerialCode(e.target.value.trim())}
        />
        <MainButton onClick={onSendSerialCode}>Отправить</MainButton>
      </div>
      {!data && <p>Такого серийного номера не существует!</p>}
      {data && (
        <div className="serialCodePage__data">
          <p>Страна: {data.country}</p>
          <p>Диллер: {data.diller}</p>
          <p>Дата: {data.date}</p>
					<p>Ссылка на софт: <Link to='/serial'>ссылка</Link></p>
        </div>
      )}
    </div>
  );
};

export default SerialCodePage;
