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
import {z} from "zod";

declare global {
  interface Window {
    recaptchaVerifier?: any;
    confirmationResult?: any;
  }
}

// ZOD схемы для валидации
const formSchema = z.object({
	email: z.string().email('Некорректный email'),
	phone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
	code: z.string().regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
});
const phoneSchema = z.object({
	phone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
});


const AuthPage = () => {
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("+7");
  const [code, setCode] = React.useState("");
  const [isHintActive, setIsHintActive] = React.useState(false);
	const [errors, setErrors] = React.useState<any>();
  const { tg } = useTelegram();

  // Коллбэк для отправки данных боту
  const onSendData = React.useCallback(() => {
		const validation = formSchema.safeParse({ email, phone,code });
		if (!validation.success) {
			const validationErrors = validation.error.format();
			setErrors(validationErrors);
			return
		}

    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(code)
      .then((result: any) => {
        tg.sendData(JSON.stringify({ result, email, msg: "authorization", idToken: result.user.uid }));
      })
      .catch((error: Error) => {
        tg.sendData(JSON.stringify({ error, msg: "invalid_code" }));
      });
			setErrors(null);
  }, [tg, code, email, phone]);

  // Отправка кода на телефон
  const onSendCode = () => {
		const validation = phoneSchema.safeParse({ phone });
		if (!validation.success) {
			console.log(validation.error.format());
			const validationErrors = validation.error.format();
			setErrors(validationErrors);
			return
		}
		setErrors(null)
		setIsHintActive(true);
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Генерация recaptcha для отправки смс
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

  // Добавление слушателя на событие нажатия на main телеграм кнопку
  React.useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [tg, onSendData]);

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
    if (!email || !phone || !code) {
      tg?.MainButton.disable();
    } else {
      tg?.MainButton.enable();
    }
  }, [tg.MainButton, email, phone, code]);

  // При монтировании компонента проверяем авторизован ли пользователь
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
				const idToken = await user.getIdToken();
        timer = setTimeout(() => {
          tg.sendData(JSON.stringify({ msg: "authorized", idToken }));
        }, 1000);
      } else {
        generateRecaptcha();
      }
    });

    return () => {
      clearTimeout(timer);
    };
  }, [tg]);

  return (
    <div className="authPage">
      <h2>Заполните форму для авторизации</h2>
      <FormInput
        placeholder="Почта:"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
				error={errors?.email?._errors.join(", ")}
      />
      <FormInput
        placeholder="Телефон:"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
				error={errors?.phone?._errors.join(", ")}
      />
      <div className="authPage__checkCode">
        <MainButton
          onClick={() => {
            onSendCode();
          }}
        >
          Выслать код по SMS
        </MainButton>
        <div id="recaptcha-container"></div>
        <p className={isHintActive ? "active" : ""}>
          Код придет в течении нескольких секунд
        </p>
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
