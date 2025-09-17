import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Users, CheckCircle, Clock } from 'lucide-react';

const DeviceAssignmentDashboard = () => {
  const [devicesNeedingAssignment, setDevicesNeedingAssignment] = useState([]);
  const [activeDevices, setActiveDevices] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Fetch data every 10 seconds to match device data frequency
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for devices needing assignment
        const devicesResponse = await fetch('/api/dosimeter/devices/needing-assignment');
        const devices = await devicesResponse.json();
        setDevicesNeedingAssignment(devices);

        // Get active devices
        const activeResponse = await fetch('/api/dosimeter/devices/active');
        const active = await activeResponse.json();
        setActiveDevices(active);

        // Get available users
        const usersResponse = await fetch('/api/dosimeter/users/available');
        const users = await usersResponse.json();
        setAvailableUsers(users);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAssignDevice = async () => {
    if (!selectedDevice || !selectedUserId) {
      setAlerts([...alerts, { type: 'error', message: 'Please select both device and user' }]);
      return;
    }

    setIsAssigning(true);
    try {
      const response = await fetch(`/api/dosimeter/assign?userId=${selectedUserId}&deviceId=${selectedDevice}`, {
        method: 'POST',
      });

      if (response.ok) {
        setAlerts([...alerts, { 
          type: 'success', 
          message: `Device ${selectedDevice} successfully assigned to user` 
        }]);
        setSelectedDevice(null);
        setSelectedUserId('');
        // Remove device from needing assignment list
        setDevicesNeedingAssignment(prev => prev.filter(d => d !== selectedDevice));
      } else {
        const error = await response.text();
        setAlerts([...alerts, { type: 'error', message: `Assignment failed: ${error}` }]);
      }
    } catch (error) {
      setAlerts([...alerts, { type: 'error', message: `Error: ${error.message}` }]);
    } finally {
      setIsAssigning(false);
    }
  };

  const dismissAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dosimeter Device Management</h1>

      {/* Alerts */}
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
            alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {alert.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {alert.message}
          </div>
          <button onClick={() => dismissAlert(index)} className="text-sm underline">
            Dismiss
          </button>
        </div>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Devices Needing Assignment */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Devices Needing Assignment</h2>
          </div>
          
          {devicesNeedingAssignment.length === 0 ? (
            <p className="text-gray-500 italic">No devices need assignment</p>
          ) : (
            <div className="space-y-2">
              {Array.from(devicesNeedingAssignment).map((deviceId) => (
                <div
                  key={deviceId}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDevice === deviceId ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedDevice(deviceId)}
                >
                  <div className="font-medium">Device: {deviceId}</div>
                  <div className="text-sm text-gray-600">Status: Active, Ready for Assignment</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Available Users</h2>
          </div>
          
          {selectedDevice && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium">Assigning device: {selectedDevice}</p>
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedUserId === user.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                }`}
                onClick={() => setSelectedUserId(user.id)}
                >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">Role: {user.role}</div>
              </div>
            ))}
          </div>
            {availableUsers.length === 0 && (
                <p className="text-gray-500 italic">No available users</p>
            )}

          <button
            onClick={handleAssignDevice}
            disabled={isAssigning || !selectedDevice || !selectedUserId}
            className={`mt-6 w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors ${
                isAssigning || !selectedDevice || !selectedUserId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isAssigning ? 'Assigning...' : 'Assign Device'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeviceAssignmentDashboard;   