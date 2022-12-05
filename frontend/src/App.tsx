import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import { useTelegram } from './hooks/useTelegram';
import { Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/AuthPage/LoginPage';

function App() {
  return (
    <div className='wrapper'>
			<Header/>
			<Routes>
				<Route index element={<MainPage/>}/>
				<Route path='/auth' element={<LoginPage/>}/>
			</Routes>
    </div>
  );
}

export default App;
