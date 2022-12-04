import React, { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';

function App() {
	const {onClose} = useTelegram()

	useEffect(() => {

	},[])

  return (
    <div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default App;
