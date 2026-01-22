import { useState, useEffect } from 'react'
import Sidebar from '../../components/Layout/Sidebar'
import Users from '../Users'
import Employees from '../Employees'
import './dashboard.css'

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('users');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
      />
      <main className="dashboard-main">
        {activeMenu === 'users' && <Users />}
        {activeMenu === 'employees' && <Employees />}
      </main>
    </div>
  );
}
