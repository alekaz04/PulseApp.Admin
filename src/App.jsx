import { useState } from 'react';
import { LoginPage } from './components/LoginPage.jsx';
import { DashboardLayout } from './components/DashboardLayout.jsx';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('pulse_api_key'))
  );

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('pulse_api_key');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <DashboardLayout onLogout={handleLogout} />;
  }
  return <LoginPage onLogin={handleLogin} />;
}
