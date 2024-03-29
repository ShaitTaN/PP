import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
// import AuthPage from "./pages/AuthPage/AuthPage";
// import { auth } from "./firebase";
// import { onAuthStateChanged } from "firebase/auth";
import { useTelegram } from "./hooks/useTelegram";
import SerialCodePage from "./pages/SerialCodePage/SerialCodePage";
import SerialCodePageAdd from "./pages/SerialCodePage/SerialCodePageAdd";
import ChatModal from "./components/ChatModal/ChatModal";
// import LogOutPage from "./pages/LogOutPage/LogOutPage";

function App() {
  // const [idToken, setIdToken] = React.useState("loading");
  const [chatIsOpen, setChatIsOpen] = React.useState(true);
  const { tg } = useTelegram();

  // При монтировании компонента App, проверяем авторизован ли пользователь
  React.useEffect(() => {
    tg.ready();
    // onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     try {
    //       const idToken = await user.getIdToken(true);
    //       setIdToken(idToken);
    // 			console.log(idToken);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   } else {
    //     setIdToken("");
    //   }
    // });
  }, [tg]);

  return (
    <div className="wrapper">
      <Header />
      {tg.platform === "unknown" && (
        <ChatModal isOpen={chatIsOpen} setIsOpen={setChatIsOpen} />
      )}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/serial" element={<SerialCodePage />} />
        {/* <Route path="/logout" element={<LogOutPage idToken={idToken} />} /> */}
        <Route path="/serial-add" element={<SerialCodePageAdd />} />
        {/* <Route path="/auth" element={<AuthPage idToken={idToken} />} /> */}
      </Routes>
    </div>
  );
}

export default App;
