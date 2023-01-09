import React from "react";
import { auth } from "../../firebase";
import { useTelegram } from "../../hooks/useTelegram";
import "./logoutPage.css";

interface LogOutPageProps {
  idToken: string;
}

const LogOutPage: React.FC<LogOutPageProps> = ({ idToken }) => {
  const { tg } = useTelegram();

  const onLogOut = React.useCallback(async () => {
    try {
      await auth.signOut();
      tg.sendData(JSON.stringify({ msg: "logout" }));
    } catch (error) {
      tg.sendData(JSON.stringify({ msg: "logoutError", error }));
    }
  }, [tg]);

  // Подписка на событие нажатия на main телеграм кнопку
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

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!idToken) {
      timer = setTimeout(() => {
        tg.sendData(JSON.stringify({ msg: "not_authorized" }));
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [tg, idToken]);

  return (
    <div className="logoutPage">
      <h1>Вы хотите выйти из аккаунта?</h1>
    </div>
  );
};

export default LogOutPage;
