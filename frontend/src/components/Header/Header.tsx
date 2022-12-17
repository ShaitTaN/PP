import React from "react";
import { Link } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";
// import { auth } from "../../firebase";
import "./header.css";

interface HeaderProps {
  isAuthorized: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isAuthorized
}) => {
  const [isMenuActive, setIsMenuActive] = React.useState(false);
  const { tg, user: tgUser } = useTelegram();

  const onToggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  return (
    <>
      <div
        className={`burger ${isMenuActive ? "active" : ""}`}
        onClick={onToggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <header className={`header ${isMenuActive ? "active" : ""}`}>
        {tg.platform === "unknown" && (
          <Link className="header__link" to={"/"}>
            Главная
          </Link>
        )}
        {tg.platform === "unknown" && (
          <Link className="header__link" to={"/serial"}>
            Серийный номер
          </Link>
        )}
        {tgUser && (
          <div className="header__user">
            <span>{tgUser.username}</span>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
