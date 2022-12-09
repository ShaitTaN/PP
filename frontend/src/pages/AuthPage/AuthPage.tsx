import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import { useTelegram } from "../../hooks/useTelegram";
import "./authPage.css";

const AuthPage = () => {
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const { tg } = useTelegram();

  React.useEffect(() => {
		console.log('effect')
		tg?.MainButton.setParams({text: 'Отправить'})
    tg?.MainButton.show()
  }, [tg.MainButton]);

  return (
    <div className="authPage">
      <h2>Заполните форму для авторизации</h2>
      <FormInput
        placeholder="Почта:"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormInput
        placeholder="Телефон:"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <FormInput
        placeholder="Код подтверждения:"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>
  );
};

export default AuthPage;
