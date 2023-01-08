import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { auth} from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTelegram } from "./hooks/useTelegram";
import SerialCodePage from "./pages/SerialCodePage/SerialCodePage";
import SerialCodePageAdd from "./pages/SerialCodePage/SerialCodePageAdd";
import ChatModal from "./components/ChatModal/ChatModal";

function App() {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [userGroup, setUserGroup] = React.useState("user");
  const [idToken, setIdToken] = React.useState("");
	const [chatIsOpen, setChatIsOpen] = React.useState(true);
  const { user: tgUser, tg } = useTelegram();

  // При монтировании компонента App, проверяем авторизован ли пользователь
  React.useEffect(() => {
		tg.ready()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true);
          setIdToken(idToken);
        } catch (error) {
          console.log(error);
        }
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        setUserGroup("user");
				setIdToken("");
      }
    });
  }, [isAuthorized, tgUser, tg, userGroup]);

  return (
    <div className="wrapper">
      <Header
        isAuthorized={isAuthorized}
      />
			{tg.platform === "unknown" && <ChatModal isOpen={chatIsOpen} setIsOpen={setChatIsOpen} />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/serial"
          element={<SerialCodePage/>}
        />
        <Route
          path="/serial-add"
          element={<SerialCodePageAdd idToken={idToken} />}
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              isAuthorized={isAuthorized}
              setIsAuthorized={setIsAuthorized}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
