import { Link } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";
import "./header.css";

const Header = () => {
	const {user} = useTelegram()
  const isAuth = false;

  return (
    <header className="header">
      <Link className="header__link" to={"/"}>
        Главная
      </Link>
      {isAuth ? (
        <div className="header__user">
          <span>{user?.username || 'USER'}</span>
          <button>Выход</button>
        </div>
      ) : (
        <Link className="header__link" to={"/auth"}>
          Авторизация
        </Link>
      )}
    </header>
  );
};

export default Header;
