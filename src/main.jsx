import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home/index.jsx'
import Dashboard from './pages/Dashboard/index.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <Home />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
