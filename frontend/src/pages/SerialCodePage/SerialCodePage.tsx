import React from "react";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import MainButton from "../../components/MainButton/MainButton";
import "./serialCodePage.css";

interface SerialCode {
  code: string;
  country: string;
  diller: string;
  date: string;
}

interface SerialCodePageProps {
  userGroup: string;
}

const SerialCodePage: React.FC<SerialCodePageProps> = ({ userGroup }) => {
  const [serialCode, setSerialCode] = React.useState("");
  const [data, setData] = React.useState<SerialCode | null>(null);
  const [isActive, setIsActive] = React.useState(false);

  const onSendSerialCode = async () => {
    try {
      const res = await fetch("http://localhost:3030/serial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serialCode }),
      });
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
    setIsActive(true);
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
      {!data && isActive && <p>Такого серийного номера не существует!</p>}
      {data && (
        <div className="serialCodePage__data">
          <p>Страна: {data.country}</p>
          <p>Диллер: {data.diller}</p>
          <p>Дата: {data.date}</p>
          <p>
            Ссылка на софт: <Link to="/serial">ссылка</Link>
          </p>
        </div>
      )}
      {(userGroup === "admin" || userGroup === "personal") && (
        <Link className="serialCodePage__add" to="/serial-add">
          Добавить серийный номер
        </Link>
      )}
    </div>
  );
};

export default SerialCodePage;
