import './App.css';
import Header from './components/Header/Header';
import { Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
  return (
    <div className='wrapper'>
			<Header/>
			<Routes>
				<Route path='/' element={<MainPage/>}/>
				<Route path='/auth' element={<AuthPage/>}/>
			</Routes>
    </div>
  );
}

export default App;
