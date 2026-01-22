
import { useState } from 'react'
import api from '../../config/api'
import './style.css'

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      setSuccess('Login realizado com sucesso!');
      localStorage.setItem('authToken', response.data.token);
      setUsername('');
      setPassword('');
      
      // Redirecionar ou executar ação após login bem-sucedido
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Home;
