import React, { useEffect, useState } from 'react';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [deviceId, setDeviceId] = useState('DOCI_001');
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const assignDosimeter = async () => {
    if (!selectedUser || !deviceId) return;
    try {
      await api.post(`/dosimeter/assign?userId=${selectedUser}&deviceId=${deviceId}`);
      alert("Dosimeter assigned successfully!");
    } catch (error) {
      alert("Assignment failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Welcome, {email}</h2>

      <div style={{ marginTop: '20px' }}>
        <h4>Assign Dosimeter</h4>
        <label>Dosimeter ID:</label>
        <input
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        />

        <br /><br />

        <label>Select User:</label>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">-- Select --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        <br /><br />
        <button onClick={assignDosimeter}>Assign Dosimeter</button>
      </div>

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
