import { useState, useEffect } from 'react'
import api from '../../config/api'
import '../styles/crud.css'

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email) {
      setError('Preencha username e email');
      return;
    }

    if (!editingId && !formData.password) {
      setError('Senha é obrigatória para novo usuário');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, formData);
      } else {
        await api.post('/users', formData);
      }
      await fetchUsers();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;

    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao deletar usuário');
    }
  };

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '' });
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Gerenciamento de Usuários</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Novo Usuário
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Digite o username"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite o email"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha {editingId && '(deixe em branco para manter)'}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite a senha"
                required={!editingId}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading">Carregando...</div>}

      {!loading && users.length === 0 && !showForm && (
        <div className="empty-state">Nenhum usuário cadastrado</div>
      )}

      {!loading && users.length > 0 && (
        <div className="table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(user)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑️ Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
