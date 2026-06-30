import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('token')),
  );

  function handleAuthenticated(token: string) {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  return isAuthenticated ? (
    <HomePage onLogout={handleLogout} />
  ) : (
    <LoginPage onAuthenticated={handleAuthenticated} />
  );
}

export default App;
