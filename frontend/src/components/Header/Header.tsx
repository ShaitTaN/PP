import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import "./header.css";

interface HeaderProps {
	isAuthorized: boolean;
	setIsAuthorized: (isAuthorized: boolean) => void;
	tgUser: any;
}

const Header: React.FC<HeaderProps> = ({isAuthorized, setIsAuthorized, tgUser}) => {

	const onLogout = () => {
		auth.signOut().then(()=>{
			setIsAuthorized(false)
		})
	}

  return (
    <header className="header">
      <Link className="header__link" to={"/"}>
        Главная
      </Link>
      {isAuthorized && (
        <div className="header__user">
          <span>{tgUser?.username}</span>
          <button onClick={onLogout}>Выход</button>
        </div>
      )}
    </header>
  );
};

export default Header;
