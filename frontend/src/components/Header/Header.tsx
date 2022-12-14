import React from "react";
import { Link } from "react-router-dom";
// import { auth } from "../../firebase";
import "./header.css";

interface HeaderProps {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
	setIdToken: (idToken: string) => void;
  tgUser: any;
}

const Header: React.FC<HeaderProps> = ({isAuthorized,setIsAuthorized,tgUser, setIdToken}) => {
	const [isMenuActive, setIsMenuActive] = React.useState(false);

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
		{tgUser.username}
      <div className={`burger ${isMenuActive ? 'active' : ''}`} onClick={onToggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <header className={`header ${isMenuActive ? 'active' : ''}`}>
        <Link className="header__link" to={"/"}>
          Главная
        </Link>
        {!tgUser.username && <Link className="header__link" to={"/serial"}>
          Серийный номер
        </Link>}
        {isAuthorized && tgUser && (
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
