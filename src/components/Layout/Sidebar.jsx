import { useState } from 'react'
import './sidebar.css'

export default function Sidebar({ activeMenu, setActiveMenu, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    onLogout();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">Admin</h1>
        <button 
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Fechar" : "Abrir"}
        >
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeMenu === 'users' ? 'active' : ''}`}
          onClick={() => setActiveMenu('users')}
        >
          <span className="icon">👤</span>
          {isOpen && <span>Usuários</span>}
        </button>
        
        <button
          className={`nav-item ${activeMenu === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveMenu('employees')}
        >
          <span className="icon">👥</span>
          {isOpen && <span>Funcionários</span>}
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
