import React, { useEffect, useState } from 'react';
import api, { assignDevice } from '../services/api';
import DosimeterCard from '../components/DosimeterCard';

const Dashboard = () => {
  const [dosimeters, setDosimeters] = useState({});
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);   // list of users
  const [selectedUsers, setSelectedUsers] = useState({}); // track selected user per device

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchDosimeterData();
    fetchUsers();

    const interval = setInterval(() => {
      fetchDosimeterData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 Fetch all dosimeters data
  const fetchDosimeterData = async () => {
    try {
      const res = await api.get("/get/json");
      const data = res.data;

      setDosimeters(prev => ({
        ...prev,
        [data.deviceId]: data
      }));
    } catch (err) {
      setMessage("Error fetching dosimeter data");
    }
  };

  // 🔹 Fetch user list
  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all"); // backend endpoint for users
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // 🔹 Assign dosimeter to selected user
  const handleAssign = async (deviceId) => {
    const userId = selectedUsers[deviceId];
    if (!userId) {
      setMessage("Please select a user first");
      return;
    }
    // Debug: show token before request
    const token = localStorage.getItem('token');
    console.log("Token before assign request:", token);
    try {
      await assignDevice(userId, deviceId);
      setMessage(`Device ${deviceId} assigned to user ${userId}`);
      fetchDosimeterData();
    } catch (err) {
      if (err.response) {
        setMessage(
          `Assignment failed: ${err.response.status} - ${err.response.data.error || ''} - ${err.response.data.message || ''}`
        );
        console.error("Assignment error:", err.response);
        // Debug: show headers sent
        console.log("Request headers:", err.response.config.headers);
        // Debug: show full config
        console.log("Full request config:", err.response.config);
      } else {
        setMessage("Assignment failed: Unauthorized or network error");
        console.error("Assignment error:", err);
      }
    }
  };

  const downloadJson = (deviceId) => {
    window.open(`/download/json/${deviceId}`, '_blank');
  };

  const downloadCsv = (deviceId) => {
    window.open(`/download/csv/${deviceId}`, '_blank');
  };

  return (
    <div className="p-4">
      <h2>Dosimeter Dashboard</h2>
      {message && <p>{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(dosimeters).map(d => (
          <div key={d.deviceId} className="border p-3 rounded shadow">
            <DosimeterCard deviceId={d.deviceId} data={d} isStopper={d.status} />

            <p><strong>Device ID:</strong> {d.deviceId}</p>
            <p><strong>Status:</strong> {d.status}</p>

            {/* 🔹 If dosimeter is active but not yet assigned → show dropdown */}
            {d.status === 'Active' && !d.assigned && (
              <div>
                <select
                  className="border px-2 py-1"
                  value={selectedUsers[d.deviceId] || ""}
                  onChange={(e) =>
                    setSelectedUsers(prev => ({
                      ...prev,
                      [d.deviceId]: e.target.value
                    }))
                  }
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <button
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleAssign(d.deviceId)}
                >
                  Assign
                </button>
              </div>
            )}

            {/* 🔹 Already assigned */}
            {d.assigned && (
              <p className="text-green-600">Assigned to you</p>
            )}

            {/* 🔹 If inactive → download options */}
            {d.status === 'INACTIVE' && (
              <div className="mt-3 space-x-2">
                <button
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                  onClick={() => downloadJson(d.deviceId)}
                >
                  Download JSON
                </button>
                <button
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                  onClick={() => downloadCsv(d.deviceId)}
                >
                  Download CSV
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
