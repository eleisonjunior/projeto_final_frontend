import { useState, useEffect } from 'react'
import api from '../../config/api'
import '../styles/crud.css'

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    salary: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/funcionarios');
      setEmployees(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar funcionários');
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

    if (!formData.nome || !formData.email || !formData.position) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/funcionarios/${editingId}`, formData);
      } else {
        await api.post('/funcionarios', formData);
      }
      await fetchEmployees();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar funcionário');
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.nome,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      salary: employee.salary,
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;

    try {
      await api.delete(`/funcionarios/${id}`);
      await fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao deletar funcionário');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      phone: '',
      position: '',
      salary: '',
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Gerenciamento de Funcionários</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Novo Funcionário
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
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
              <label>Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Digite o telefone"
              />
            </div>

            <div className="form-group">
              <label>Cargo *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Digite o cargo"
                required
              />
            </div>

            <div className="form-group">
              <label>Salário</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Digite o salário"
                step="0.01"
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

      {!loading && employees.length === 0 && !showForm && (
        <div className="empty-state">Nenhum funcionário cadastrado</div>
      )}

      {!loading && employees.length > 0 && (
        <div className="table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cargo</th>
                <th>Salário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.nome}</td>
                  <td>{employee.email}</td>
                  <td>{employee.telefone || '-'}</td>
                  <td>{employee.cargo}</td>
                  <td>{employee.salario ? `R$ ${parseFloat(employee.salario).toFixed(2)}` : '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(employee)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(employee.id)}
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
