import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import "./serialCodePage.css";

const SerialCodePage = () => {
  const [serialCode, setSerialCode] = React.useState("");

  return (
    <div className="serialCodePage">
      <h2>Введите ваш серийный номер для проверки</h2>
      <div className="serialCodePage__input">
        <FormInput
          placeholder="Серийный номер:"
          value={serialCode}
          onChange={(e) => setSerialCode(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SerialCodePage;
