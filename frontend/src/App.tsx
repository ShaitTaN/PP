import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import { Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
	const [isAuthorized, setIsAuthorized] = React.useState(false);

  return (
    <div className='wrapper'>
			<Header isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} />
			<Routes>
				<Route path='/' element={<MainPage/>}/>
				<Route path='/auth' element={<AuthPage isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} />}/>
			</Routes>
    </div>
  );
}

export default App;
