import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import "./header.css";

interface HeaderProps {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
  tgUser: any;
}

const Header: React.FC<HeaderProps> = ({isAuthorized,setIsAuthorized,tgUser,}) => {
	const [isMenuActive, setIsMenuActive] = React.useState(false);

  const onLogout = () => {
    auth.signOut().then(() => {
      setIsAuthorized(false);
    });
  };

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
        <Link className="header__link" to={"/serial"}>
          Серийный номер
        </Link>
        {isAuthorized && tgUser && (
        // {isAuthorized && (
          <div className="header__user">
            <span>{tgUser?.username || "USERNAME"}</span>
            <button onClick={onLogout}>Выход</button>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
