import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  const isAuth = true;

  return (
    <div className="header">
      <Link className="header__link" to={"/"}>
        Главная
      </Link>
      {isAuth ? (
        <div className="header__user">
          <span>UserName</span>
          <button>Выход</button>
        </div>
      ) : (
        <Link className="header__link" to={"/auth"}>
          Авторизация
        </Link>
      )}
    </div>
  );
};

export default Header;
