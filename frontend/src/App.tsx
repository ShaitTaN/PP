import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTelegram } from "./hooks/useTelegram";
import SerialCodePage from "./pages/SerialCodePage/SerialCodePage";
import SerialCodePageAdd from "./pages/SerialCodePage/SerialCodePageAdd";

function App() {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [userGroup, setUserGroup] = React.useState("user");
  const [idToken, setIdToken] = React.useState("");
  const { user } = useTelegram();

  // При монтировании компонента App, проверяем авторизован ли пользователь
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true);
          setIdToken(idToken);
          const res = await fetch("http://localhost:3030/auth", {
            method: "POST",
            body: JSON.stringify({ uid: user.uid }),
            headers: {
              AuthToken: idToken,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setUserGroup(data.userGroup);
        } catch (error) {
          console.log(error);
        }
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });
  }, [setIsAuthorized]);

  return (
    <div className="wrapper">
      <Header
        tgUser={user}
        isAuthorized={isAuthorized}
        setIsAuthorized={setIsAuthorized}
      />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/serial"
          element={<SerialCodePage userGroup={userGroup} />}
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
