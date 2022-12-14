import React from "react";
import { Link } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";
// import { auth } from "../../firebase";
import "./header.css";

interface HeaderProps {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
	setIdToken: (idToken: string) => void;
}

const Header: React.FC<HeaderProps> = ({isAuthorized,setIsAuthorized, setIdToken}) => {
	const [isMenuActive, setIsMenuActive] = React.useState(false);
	const {tg, user: tgUser} = useTelegram();

  // const onLogout = () => {
  //   auth.signOut().then(() => {
  //     setIsAuthorized(false);
	// 		setIdToken('');
  //   });
  // };

	const onToggleMenu = () => {
		setIsMenuActive(!isMenuActive);
	}

  return (
    <>
      <div className={`burger ${isMenuActive ? 'active' : ''}`} onClick={onToggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <header className={`header ${isMenuActive ? 'active' : ''}`}>
        <Link className="header__link" to={"/"}>
          Главная
        </Link>
        { tg.platform === "unknown" && <Link className="header__link" to={"/serial"}>
          Серийный номер
        </Link>}
        { tgUser && (
          <div className="header__user">
            <span>{tgUser.username}</span>
            {/* <button onClick={onLogout}>Выход</button> */}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
