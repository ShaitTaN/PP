import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import MainButton from "../../components/MainButton/MainButton";
import { useTelegram } from "../../hooks/useTelegram";
import "./authPage.css";
import { auth } from "../../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    recaptchaVerifier?: any;
    confirmationResult?: any;
  }
}

interface AuthPageProps {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({
  isAuthorized,
  setIsAuthorized,
}) => {
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("+7");
  const [code, setCode] = React.useState("");
  const navigate = useNavigate();
  const { tg } = useTelegram();

  const onSendData = React.useCallback(() => {
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(code)
      .then((result: any) => {
        setIsAuthorized(true);
        tg.sendData(JSON.stringify(result));
      })
      .catch((error: Error) => {
        tg.sendData("Invalid code.");
      });
  }, [tg, code, setIsAuthorized]);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: any) => {},
      },
      auth
    );
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user
          .getIdToken(true)
          .then((idToken) => {
            fetch("http://localhost:3030/auth", {
              method: "POST",
              headers: {
                AuthToken: idToken,
              },
            })
              .then((res) => console.log(res))
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        navigate("/");
      } else {
        generateRecaptcha();
      }
    });
  }, [setIsAuthorized, navigate]);

  React.useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);

    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [tg, onSendData]);

  React.useEffect(() => {
    tg?.MainButton.setParams({ text: "Отправить" });
    tg?.MainButton.show();

    return () => {
      tg?.MainButton.hide();
    };
  }, [tg.MainButton]);

  React.useEffect(() => {
    if (!email || !phone || !code) {
      tg?.MainButton.disable();
    } else {
      tg?.MainButton.enable();
    }
  }, [tg.MainButton, email, phone, code]);

  const onSendCode = () => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <div className="authPage__checkCode">
        <MainButton onClick={onSendCode}>Выслать код по SMS</MainButton>
        <div id="recaptcha-container"></div>
      </div>
      <FormInput
        placeholder="Код подтверждения:"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>
  );
};

export default AuthPage;
