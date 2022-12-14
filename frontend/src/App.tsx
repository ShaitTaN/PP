import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useTelegram } from "./hooks/useTelegram";
import SerialCodePage from "./pages/SerialCodePage/SerialCodePage";

function App() {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
	const [authUser, setAuthUser] = React.useState<User | null>(null);
	const { user } = useTelegram();

	// При монтировании компонента App, проверяем авторизован ли пользователь
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
        setIsAuthorized(true);
				setAuthUser(user);
      } else {
        setIsAuthorized(false);
				setAuthUser(null);
      }
    });
  }, [setIsAuthorized]);

  return (
    <div className="wrapper">
      <Header tgUser={user} isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} />
      <Routes>
        <Route path="/" element={<MainPage />} />
				<Route path="/serial" element={<SerialCodePage authUser={authUser} />} />
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
