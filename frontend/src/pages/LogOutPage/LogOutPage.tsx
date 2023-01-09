import React from "react";
import { auth } from "../../firebase";
import { useTelegram } from "../../hooks/useTelegram";
import "./logoutPage.css";

const LogOutPage = () => {
  const { tg } = useTelegram();

  const onLogOut = React.useCallback(async () => {
    try {
      await auth.signOut();
      tg.sendData(JSON.stringify({ msg: "logout" }));
    } catch (error) {
      tg.sendData(JSON.stringify({ msg: "logoutError", error }));
    }
  }, [tg]);

  React.useEffect(() => {
    tg.onEvent("mainButtonClicked", onLogOut);
    return () => {
      tg.offEvent("mainButtonClicked", onLogOut);
    };
  }, [tg, onLogOut]);

  // Изменение текста main телеграм кнопки и ее отображение
  React.useEffect(() => {
    tg?.MainButton.setParams({ text: "Выйти" });
    tg?.MainButton.show();
    return () => {
      tg?.MainButton.hide();
    };
  }, [tg.MainButton]);

  return (
    <div className="logoutPage">
      <h1>Вы хотите выйти из аккаунта?</h1>
    </div>
  );
};

export default LogOutPage;
