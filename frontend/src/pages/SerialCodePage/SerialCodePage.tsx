import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import MainButton from "../../components/MainButton/MainButton";
import { useTelegram } from "../../hooks/useTelegram";
// import { Link } from "react-router-dom";
import "./serialCodePage.css";

// interface SerialCode {
//   code: string;
//   country: string;
//   diller: string;
//   date: string;
// }

interface SerialCodePageProps {
  userGroup: string;
}

const SerialCodePage: React.FC<SerialCodePageProps> = ({ userGroup }) => {
  const [serialCode, setSerialCode] = React.useState("");
  // const [data, setData] = React.useState<SerialCode | null>(null);
  // const [isActive, setIsActive] = React.useState(false);
	const {queryId, tg} = useTelegram()

  const onSendSerialCode = React.useCallback(async () => {
    // try {
      fetch("http://localhost:3030/serial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serialCode, queryId }),
      });
      // const data = await res.json();
      // setData(data);
    // } catch (error) {
    //   console.log(error);
    // }
  }, [serialCode, queryId]);

		// Подписка на событие нажатия на main телеграм кнопку
		React.useEffect(() => {
			tg.onEvent("mainButtonClicked", onSendSerialCode);
			return () => {
				tg.offEvent("mainButtonClicked", onSendSerialCode);
			};
		}, [tg, onSendSerialCode]);
	
		// Изменение текста main телеграм кнопки и ее отображение
		React.useEffect(() => {
			tg?.MainButton.setParams({ text: "Отправить" });
			tg?.MainButton.show();
			return () => {
				tg?.MainButton.hide();
			};
		}, [tg.MainButton]);
	
		// Отключение main телеграм кнопки при незаполненных полях
		React.useEffect(() => {
			if (!serialCode) {
				tg?.MainButton.disable();
			} else {
				tg?.MainButton.enable();
			}
		}, [tg.MainButton, serialCode]);
	

  return (
    <div className="serialCodePage">
      <h2>Введите ваш серийный номер для проверки</h2>
      <div className="serialCodePage__input">
        <FormInput
          placeholder="Серийный номер:"
          value={serialCode}
          onChange={(e) => setSerialCode(e.target.value.trim())}
        />
        {!queryId && <MainButton onClick={onSendSerialCode}>Отправить</MainButton>}
      </div>
      {/* {!data && isActive && <p>Такого серийного номера не существует!</p>}
      {data && (
        <div className="serialCodePage__data">
          <p>Страна: {data.country}</p>
          <p>Диллер: {data.diller}</p>
          <p>Дата: {data.date}</p>
          <p>
            Ссылка на софт: <Link to="/serial">ссылка</Link>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default SerialCodePage;
