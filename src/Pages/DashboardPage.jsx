// import React, { useState, useEffect } from 'react';
// import { 
//   getDemoJson, 
//   getDevicesNeedingAssignment, 
//   getAvailableUsers, 
//   getActiveDevices,
//   assignDevice,
//   releaseDevice,
//   getReadingsByUser,
//   exportUserCsv,
//   exportDeviceCsv,
//   getUserAlerts
// } from '../services/api';

// const DashboardPage = () => {
//   const [devices, setDevices] = useState({});
//   const [devicesNeedingAssignment, setDevicesNeedingAssignment] = useState(new Set());
//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState({});
//   const [message, setMessage] = useState('');
//   const [activeDevices, setActiveDevices] = useState(new Set());
//   const [userReadings, setUserReadings] = useState([]);
//   const [userAlerts, setUserAlerts] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [selectedUserForModal, setSelectedUserForModal] = useState(null);

//   useEffect(() => {
//     fetchInitialData();
    
//     // Simulate device data every 10 seconds (as per your requirement)
//     const interval = setInterval(fetchDeviceData, 10000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const fetchInitialData = async () => {
//     try {
//       await Promise.all([
//         fetchUsers(),
//         fetchDevicesNeedingAssignment(),
//         fetchActiveDevices(),
//         fetchDeviceData()
//       ]);
//     } catch (error) {
//       console.error('Error fetching initial data:', error);
//       setMessage('Error loading dashboard data');
//     }
//   };

//   const fetchDeviceData = async () => {
//     try {
//       const response = await getDemoJson();
//       const deviceData = response.data;
      
//       setDevices(prev => ({
//         ...prev,
//         [deviceData.deviceId]: {
//           ...deviceData,
//           timestamp: new Date().toISOString(),
//           cpmValue: parseFloat(deviceData.cpm) || 0
//         }
//       }));

//       // Check if this is a new active device
//       if (deviceData.status === 'Active') {
//         await checkForNewAssignments();
//       }
//     } catch (error) {
//       console.error('Error fetching device data:', error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await getAvailableUsers();
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchDevicesNeedingAssignment = async () => {
//     try {
//       const response = await getDevicesNeedingAssignment();
//       setDevicesNeedingAssignment(new Set(response.data));
//     } catch (error) {
//       console.error('Error fetching devices needing assignment:', error);
//     }
//   };

//   const fetchActiveDevices = async () => {
//     try {
//       const response = await getActiveDevices();
//       setActiveDevices(new Set(response.data));
//     } catch (error) {
//       console.error('Error fetching active devices:', error);
//     }
//   };

//   const checkForNewAssignments = async () => {
//     await fetchDevicesNeedingAssignment();
//   };

//   const handleAssignDevice = async (deviceId) => {
//     const userId = selectedUsers[deviceId];
//     if (!userId) {
//       setMessage('Please select a user first');
//       return;
//     }

//     try {
//       await assignDevice(userId, deviceId);
//       setMessage(`Device ${deviceId} assigned successfully`);
      
//       // Update state
//       setDevicesNeedingAssignment(prev => {
//         const updated = new Set(prev);
//         updated.delete(deviceId);
//         return updated;
//       });
      
//       // Clear selection
//       setSelectedUsers(prev => {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         return updated;
//       });

//       // Refresh data
//       await fetchActiveDevices();
//     } catch (error) {
//       console.error('Assignment error:', error);
//       setMessage(`Assignment failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleReleaseDevice = async (deviceId) => {
//     try {
//       await releaseDevice(deviceId);
//       setMessage(`Device ${deviceId} released successfully`);
//       await fetchActiveDevices();
//       await fetchDevicesNeedingAssignment();
//     } catch (error) {
//       console.error('Release error:', error);
//       setMessage(`Release failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleUserSelection = (deviceId, userId) => {
//     setSelectedUsers(prev => ({
//       ...prev,
//       [deviceId]: userId
//     }));
//   };

//   const loadUserData = async (userId) => {
//     try {
//       const [readingsResponse, alertsResponse] = await Promise.all([
//         getReadingsByUser(userId),
//         getUserAlerts(userId)
//       ]);
      
//       setUserReadings(readingsResponse.data);
//       setUserAlerts(alertsResponse.data);
//       setCurrentUser(userId);
//     } catch (error) {
//       console.error('Error loading user data:', error);
//       setMessage('Error loading user data');
//     }
//   };

//   const handleExportUserCsv = async (userId) => {
//     try {
//       const response = await exportUserCsv(userId);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `user_${userId}_data.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Export error:', error);
//       setMessage('Export failed');
//     }
//   };

//   const handleExportDeviceCsv = async (deviceId) => {
//     try {
//       const response = await exportDeviceCsv(deviceId);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `device_${deviceId}_data.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Export error:', error);
//       setMessage('Export failed');
//     }
//   };

//   const openUserModal = async (user) => {
//     setSelectedUserForModal(user);
//     setShowUserModal(true);
//     await loadUserData(user.id);
//   };

//   const closeUserModal = () => {
//     setShowUserModal(false);
//     setSelectedUserForModal(null);
//     setUserReadings([]);
//     setUserAlerts([]);
//     setCurrentUser(null);
//   };

//   const getRadiationLevel = (cpm) => {
//     if (cpm < 50) return { level: 'LOW', color: 'success', icon: 'check-circle' };
//     if (cpm <= 100) return { level: 'NORMAL', color: 'primary', icon: 'info-circle' };
//     if (cpm <= 200) return { level: 'HIGH', color: 'warning', icon: 'exclamation-triangle' };
//     return { level: 'CRITICAL', color: 'danger', icon: 'exclamation-triangle' };
//   };

//   const DeviceCard = ({ device, deviceId }) => {
//     const radiation = getRadiationLevel(device.cpmValue);
//     const microsievert = (device.cpmValue * 0.0057).toFixed(3);
//     const needsAssignment = devicesNeedingAssignment.has(deviceId);
//     const isActive = activeDevices.has(deviceId);

//     return (
//       <div className="col-md-6 col-lg-4 mb-4">
//         <div className="card h-100 shadow-sm">
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <div className="d-flex align-items-center">
//               <i className="fas fa-radiation text-warning me-2"></i>
//               <strong>{deviceId}</strong>
//             </div>
//             <span className={`badge bg-${device.status === 'Active' ? 'success' : 'secondary'}`}>
//               {device.status}
//             </span>
//           </div>
          
//           <div className="card-body">
//             <div className="row mb-3">
//               <div className="col-6">
//                 <h5 className="mb-1">{device.cpmValue}</h5>
//                 <small className="text-muted">CPM</small>
//               </div>
//               <div className="col-6">
//                 <h5 className="mb-1">{microsievert}</h5>
//                 <small className="text-muted">µSv/h</small>
//               </div>
//             </div>
            
//             <div className={`alert alert-${radiation.color} py-2 mb-3`}>
//               <i className={`fas fa-${radiation.icon} me-2`}></i>
//               <strong>{radiation.level}</strong> radiation level
//             </div>
            
//             <div className="mb-2">
//               <small className="text-muted">Battery: {device.battery}%</small>
//             </div>
            
//             <small className="text-muted">
//               Last update: {new Date(device.timestamp).toLocaleTimeString()}
//             </small>
//           </div>
          
//           <div className="card-footer">
//             {needsAssignment && device.status === 'Active' && (
//               <div className="mb-3">
//                 <label className="form-label small">Assign to user:</label>
//                 <div className="d-flex gap-2">
//                   <select
//                     className="form-select form-select-sm"
//                     value={selectedUsers[deviceId] || ''}
//                     onChange={(e) => handleUserSelection(deviceId, e.target.value)}
//                   >
//                     <option value="">Select User</option>
//                     {users.map(user => (
//                       <option key={user.id} value={user.id}>
//                         {user.name}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() => handleAssignDevice(deviceId)}
//                     disabled={!selectedUsers[deviceId]}
//                   >
//                     Assign
//                   </button>
//                 </div>
//               </div>
//             )}
            
//             {isActive && !needsAssignment && (
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-warning btn-sm"
//                   onClick={() => handleReleaseDevice(deviceId)}
//                 >
//                   Release
//                 </button>
//                 <button
//                   className="btn btn-info btn-sm"
//                   onClick={() => handleExportDeviceCsv(deviceId)}
//                 >
//                   Export CSV
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const UserCard = ({ user }) => (
//     <div className="col-md-6 col-lg-4 mb-3">
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-start mb-3">
//             <div>
//               <h6 className="card-title mb-1">{user.name}</h6>
//               <small className="text-muted">{user.email}</small>
//             </div>
//             <span className="badge bg-primary">ID: {user.id}</span>
//           </div>
          
//           <div className="mb-3">
//             <small className="text-muted d-block">Phone: {user.phoneNo}</small>
//             <small className="text-muted d-block">Gender: {user.sex}</small>
//           </div>
          
//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-primary btn-sm"
//               onClick={() => openUserModal(user)}
//             >
//               View Data
//             </button>
//             <button
//               className="btn btn-success btn-sm"
//               onClick={() => handleExportUserCsv(user.id)}
//             >
//               Export CSV
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="container-fluid py-4">
//       {message && (
//         <div className={`alert alert-info alert-dismissible fade show`} role="alert">
//           {message}
//           <button 
//             type="button" 
//             className="btn-close" 
//             onClick={() => setMessage('')}
//           ></button>
//         </div>
//       )}

//       {/* Dashboard Stats */}
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card bg-primary text-white">
//             <div className="card-body text-center">
//               <h4>{Object.keys(devices).length}</h4>
//               <p className="mb-0">Total Devices</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card bg-success text-white">
//             <div className="card-body text-center">
//               <h4>{activeDevices.size}</h4>
//               <p className="mb-0">Active Devices</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card bg-warning text-white">
//             <div className="card-body text-center">
//               <h4>{devicesNeedingAssignment.size}</h4>
//               <p className="mb-0">Need Assignment</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card bg-info text-white">
//             <div className="card-body text-center">
//               <h4>{users.length}</h4>
//               <p className="mb-0">Total Users</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Devices Section */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h3 className="mb-0">
//               <i className="fas fa-radiation text-warning me-2"></i>
//               Dosimeter Devices
//             </h3>
//             <button 
//               className="btn btn-outline-primary btn-sm"
//               onClick={fetchInitialData}
//             >
//               <i className="fas fa-sync-alt me-2"></i>Refresh
//             </button>
//           </div>
          
//           {devicesNeedingAssignment.size > 0 && (
//             <div className="alert alert-warning mb-3">
//               <i className="fas fa-exclamation-triangle me-2"></i>
//               <strong>{devicesNeedingAssignment.size}</strong> device(s) need assignment to users
//             </div>
//           )}
          
//           <div className="row">
//             {Object.entries(devices).map(([deviceId, device]) => (
//               <DeviceCard key={deviceId} device={device} deviceId={deviceId} />
//             ))}
            
//             {Object.keys(devices).length === 0 && (
//               <div className="col-12">
//                 <div className="alert alert-info text-center">
//                   <i className="fas fa-info-circle me-2"></i>
//                   No device data available. Waiting for device connections...
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Users Section */}
//       <div className="row">
//         <div className="col-12">
//           <h3 className="mb-3">
//             <i className="fas fa-users text-primary me-2"></i>
//             System Users
//           </h3>
          
//           <div className="row">
//             {users.map(user => (
//               <UserCard key={user.id} user={user} />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* User Data Modal */}
//       {showUserModal && selectedUserForModal && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {selectedUserForModal.name}'s Dosimeter Data
//                 </h5>
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={closeUserModal}
//                 ></button>
//               </div>
              
//               <div className="modal-body">
//                 {/* User Info */}
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col-md-6">
//                         <strong>Email:</strong> {selectedUserForModal.email}
//                       </div>
//                       <div className="col-md-6">
//                         <strong>Phone:</strong> {selectedUserForModal.phoneNo}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Alerts */}
//                 {userAlerts.length > 0 && (
//                   <div className="mb-4">
//                     <h6 className="text-danger">
//                       <i className="fas fa-exclamation-triangle me-2"></i>
//                       Alert Readings ({userAlerts.length})
//                     </h6>
//                     <div className="table-responsive">
//                       <table className="table table-sm table-striped">
//                         <thead>
//                           <tr>
//                             <th>Device</th>
//                             <th>CPM</th>
//                             <th>Level</th>
//                             <th>Timestamp</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {userAlerts.slice(0, 5).map(alert => {
//                             const level = getRadiationLevel(alert.cpm);
//                             return (
//                               <tr key={alert.id}>
//                                 <td>{alert.deviceId}</td>
//                                 <td>{alert.cpm}</td>
//                                 <td>
//                                   <span className={`badge bg-${level.color}`}>
//                                     {level.level}
//                                   </span>
//                                 </td>
//                                 <td>{new Date(alert.timestamp).toLocaleString()}</td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//                 {/* Recent Readings */}
//                 <div>
//                   <h6>Recent Readings ({userReadings.length} total)</h6>
//                   <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                     <table className="table table-sm table-striped">
//                       <thead>
//                         <tr>
//                           <th>Device</th>
//                           <th>CPM</th>
//                           <th>µSv/h</th>
//                           <th>Level</th>
//                           <th>Timestamp</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userReadings.slice(0, 20).map(reading => {
//                           const level = getRadiationLevel(reading.cpm);
//                           const microsievert = (reading.cpm * 0.0057).toFixed(3);
//                           return (
//                             <tr key={reading.id}>
//                               <td>{reading.deviceId}</td>
//                               <td>{reading.cpm}</td>
//                               <td>{microsievert}</td>
//                               <td>
//                                 <span className={`badge bg-${level.color}`}>
//                                   {level.level}
//                                 </span>
//                               </td>
//                               <td>{new Date(reading.timestamp).toLocaleString()}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="modal-footer">
//                 <button 
//                   className="btn btn-success"
//                   onClick={() => handleExportUserCsv(selectedUserForModal.id)}
//                 >
//                   Export Full Data CSV
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary" 
//                   onClick={closeUserModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;












































import React, { useState, useEffect } from 'react';
import { 
  getDemoJson, 
  getDevicesNeedingAssignment, 
  getAvailableUsers, 
  getActiveDevices,
  assignDevice,
  releaseDevice,
  getReadingsByUser,
  exportUserCsv,
  exportDeviceCsv,
  getUserAlerts,
  getDeviceStatus,
  getCurrentAssignment
} from '../services/api';

const DashboardPage = () => {
  // State management
  const [devices, setDevices] = useState({});
  const [devicesNeedingAssignment, setDevicesNeedingAssignment] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [activeDevices, setActiveDevices] = useState(new Set());
  const [userReadings, setUserReadings] = useState([]);
  const [userAlerts, setUserAlerts] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [deviceAssignments, setDeviceAssignments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
    
    // Start the 10-second polling for device data
    const interval = setInterval(() => {
      fetchDeviceData();
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchDevicesNeedingAssignment(),
        fetchActiveDevices(),
        fetchDeviceData() // Initial device data fetch
      ]);
      showMessage('Dashboard loaded successfully', 'success');
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showMessage('Error loading dashboard data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceData = async () => {
    try {
      console.log('Fetching device data...');
      const response = await getDemoJson();
      const deviceData = response.data;
      
      console.log('Received device data:', deviceData);
      
      // Update device state with new data
      setDevices(prev => ({
        ...prev,
        [deviceData.deviceId]: {
          ...deviceData,
          timestamp: new Date().toISOString(),
          cpmValue: parseFloat(deviceData.cpm) || 0,
          lastUpdated: new Date()
        }
      }));

      // Check if device status changed to Active and needs assignment
      if (deviceData.status === 'Active') {
        await checkForNewAssignments();
      }

      // Check for alerts
      const cpmValue = parseFloat(deviceData.cpm) || 0;
      if (cpmValue > 100) {
        showMessage(`⚠️ ALERT: High radiation detected on device ${deviceData.deviceId}! CPM: ${cpmValue}`, 'danger');
      }

    } catch (error) {
      console.error('Error fetching device data:', error);
      // Don't show error for every failed poll, just log it
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAvailableUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('Error fetching users', 'danger');
    }
  };

  const fetchDevicesNeedingAssignment = async () => {
    try {
      const response = await getDevicesNeedingAssignment();
      setDevicesNeedingAssignment(new Set(response.data));
      console.log('Devices needing assignment:', response.data);
    } catch (error) {
      console.error('Error fetching devices needing assignment:', error);
    }
  };

  const fetchActiveDevices = async () => {
    try {
      const response = await getActiveDevices();
      setActiveDevices(new Set(response.data));
      
      // Fetch assignments for active devices
      for (const deviceId of response.data) {
        try {
          const assignmentResponse = await getCurrentAssignment(deviceId);
          if (assignmentResponse.data && typeof assignmentResponse.data === 'object' && assignmentResponse.data.id) {
            setDeviceAssignments(prev => ({
              ...prev,
              [deviceId]: assignmentResponse.data
            }));
          }
        } catch (error) {
          // Device might not be assigned, that's okay
          console.log(`Device ${deviceId} not assigned`);
        }
      }
    } catch (error) {
      console.error('Error fetching active devices:', error);
    }
  };

  const checkForNewAssignments = async () => {
    await fetchDevicesNeedingAssignment();
    await fetchActiveDevices();
  };

  const handleAssignDevice = async (deviceId) => {
    const userId = selectedUsers[deviceId];
    if (!userId) {
      showMessage('Please select a user first', 'warning');
      return;
    }

    try {
      const response = await assignDevice(userId, deviceId);
      showMessage(`Device ${deviceId} assigned successfully to user`, 'success');
      
      // Update states
      setDevicesNeedingAssignment(prev => {
        const updated = new Set(prev);
        updated.delete(deviceId);
        return updated;
      });
      
      setDeviceAssignments(prev => ({
        ...prev,
        [deviceId]: response.data
      }));
      
      // Clear selection
      setSelectedUsers(prev => {
        const updated = { ...prev };
        delete updated[deviceId];
        return updated;
      });

      // Refresh data
      await Promise.all([
        fetchActiveDevices(),
        fetchDevicesNeedingAssignment()
      ]);
    } catch (error) {
      console.error('Assignment error:', error);
      showMessage(`Assignment failed: ${error.response?.data || error.message}`, 'danger');
    }
  };

  const handleReleaseDevice = async (deviceId) => {
    if (!window.confirm(`Are you sure you want to release device ${deviceId}?`)) {
      return;
    }

    try {
      await releaseDevice(deviceId);
      showMessage(`Device ${deviceId} released successfully`, 'success');
      
      // Update states
      setDeviceAssignments(prev => {
        const updated = { ...prev };
        delete updated[deviceId];
        return updated;
      });

      await Promise.all([
        fetchActiveDevices(),
        fetchDevicesNeedingAssignment()
      ]);
    } catch (error) {
      console.error('Release error:', error);
      showMessage(`Release failed: ${error.response?.data || error.message}`, 'danger');
    }
  };

  const handleUserSelection = (deviceId, userId) => {
    setSelectedUsers(prev => ({
      ...prev,
      [deviceId]: userId
    }));
  };

  const loadUserData = async (userId) => {
    try {
      const [readingsResponse, alertsResponse] = await Promise.all([
        getReadingsByUser(userId),
        getUserAlerts(userId)
      ]);
      
      setUserReadings(readingsResponse.data);
      setUserAlerts(alertsResponse.data);
    } catch (error) {
      console.error('Error loading user data:', error);
      showMessage('Error loading user data', 'danger');
    }
  };

  const handleExportUserCsv = async (userId) => {
    try {
      const response = await exportUserCsv(userId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user_${userId}_data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showMessage('Export completed successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showMessage('Export failed', 'danger');
    }
  };

  const handleExportDeviceCsv = async (deviceId) => {
    try {
      const response = await exportDeviceCsv(deviceId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `device_${deviceId}_data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showMessage('Export completed successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showMessage('Export failed', 'danger');
    }
  };

  const openUserModal = async (user) => {
    setSelectedUserForModal(user);
    setShowUserModal(true);
    await loadUserData(user.id);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUserForModal(null);
    setUserReadings([]);
    setUserAlerts([]);
  };

  const getRadiationLevel = (cpm) => {
    if (cpm < 50) return { level: 'LOW', color: 'success', icon: 'check-circle' };
    if (cpm <= 100) return { level: 'NORMAL', color: 'primary', icon: 'info-circle' };
    if (cpm <= 200) return { level: 'HIGH', color: 'warning', icon: 'exclamation-triangle' };
    return { level: 'CRITICAL', color: 'danger', icon: 'exclamation-triangle' };
  };

  const getDeviceAssignmentInfo = (deviceId) => {
    const assignment = deviceAssignments[deviceId];
    if (assignment && assignment.user) {
      return assignment.user;
    }
    return null;
  };

  const DeviceCard = ({ device, deviceId }) => {
    const radiation = getRadiationLevel(device.cpmValue);
    const microsievert = (device.cpmValue * 0.0057).toFixed(3);
    const needsAssignment = devicesNeedingAssignment.has(deviceId);
    const isActive = activeDevices.has(deviceId);
    const assignedUser = getDeviceAssignmentInfo(deviceId);
    const timeSinceUpdate = device.lastUpdated ? 
      Math.floor((new Date() - device.lastUpdated) / 1000) : 0;

    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="fas fa-radiation text-warning me-2"></i>
              <strong>{deviceId}</strong>
            </div>
            <div>
              <span className={`badge bg-${device.status === 'Active' ? 'success' : 'secondary'} me-2`}>
                {device.status}
              </span>
              {timeSinceUpdate > 30 && (
                <span className="badge bg-warning">
                  {timeSinceUpdate}s ago
                </span>
              )}
            </div>
          </div>
          
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-6">
                <h5 className="mb-1">{device.cpmValue}</h5>
                <small className="text-muted">CPM</small>
              </div>
              <div className="col-6">
                <h5 className="mb-1">{microsievert}</h5>
                <small className="text-muted">µSv/h</small>
              </div>
            </div>
            
            <div className={`alert alert-${radiation.color} py-2 mb-3`}>
              <i className={`fas fa-${radiation.icon} me-2`}></i>
              <strong>{radiation.level}</strong> radiation level
              {device.cpmValue > 100 && (
                <div className="mt-1">
                  <small className="fw-bold">⚠️ Not safe to stay!</small>
                </div>
              )}
            </div>
            
            {assignedUser && (
              <div className="alert alert-info py-2 mb-2">
                <i className="fas fa-user me-2"></i>
                <strong>Assigned to:</strong> {assignedUser.name}
                <br />
                <small>{assignedUser.email}</small>
              </div>
            )}
            
            <div className="mb-2">
              <small className="text-muted">Battery: {device.battery}%</small>
            </div>
            
            <small className="text-muted">
              Last update: {device.timestamp ? new Date(device.timestamp).toLocaleTimeString() : 'Never'}
            </small>
          </div>
          
          <div className="card-footer">
            {needsAssignment && device.status === 'Active' && (
              <div className="mb-3">
                <div className="alert alert-warning py-2 mb-2">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Needs Assignment</strong>
                </div>
                <label className="form-label small">Assign to user:</label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    value={selectedUsers[deviceId] || ''}
                    onChange={(e) => handleUserSelection(deviceId, e.target.value)}
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAssignDevice(deviceId)}
                    disabled={!selectedUsers[deviceId]}
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}
            
            {isActive && !needsAssignment && assignedUser && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleReleaseDevice(deviceId)}
                >
                  <i className="fas fa-times me-1"></i>
                  Release
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleExportDeviceCsv(deviceId)}
                >
                  <i className="fas fa-download me-1"></i>
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const UserCard = ({ user }) => {
    const userAlertCount = userAlerts.filter(alert => 
      deviceAssignments.some(assignment => 
        assignment.user && assignment.user.id === user.id
      )
    ).length;

    return (
      <div className="col-md-6 col-lg-4 mb-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="card-title mb-1">{user.name}</h6>
                <small className="text-muted">{user.email}</small>
              </div>
              <div className="text-end">
                <span className="badge bg-primary">ID: {user.id}</span>
                {userAlertCount > 0 && (
                  <span className="badge bg-danger ms-1">
                    {userAlertCount} alerts
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <small className="text-muted d-block">Phone: {user.phoneNo}</small>
              <small className="text-muted d-block">Gender: {user.sex}</small>
            </div>
            
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => openUserModal(user)}
              >
                <i className="fas fa-eye me-1"></i>
                View Data
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleExportUserCsv(user.id)}
              >
                <i className="fas fa-download me-1"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      {message && (
        <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-radiation fa-2x mb-2"></i>
              <h4>{Object.keys(devices).length}</h4>
              <p className="mb-0">Total Devices</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <h4>{activeDevices.size}</h4>
              <p className="mb-0">Active Devices</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
              <h4>{devicesNeedingAssignment.size}</h4>
              <p className="mb-0">Need Assignment</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4>{users.length}</h4>
              <p className="mb-0">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Devices Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">
              <i className="fas fa-radiation text-warning me-2"></i>
              Dosimeter Devices
            </h3>
            <div>
              <button 
                className="btn btn-outline-primary btn-sm me-2"
                onClick={fetchDeviceData}
                disabled={loading}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Fetch Data Now
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={fetchInitialData}
                disabled={loading}
              >
                <i className="fas fa-refresh me-2"></i>
                Refresh All
              </button>
            </div>
          </div>
          
          {devicesNeedingAssignment.size > 0 && (
            <div className="alert alert-warning mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>{devicesNeedingAssignment.size}</strong> device(s) are active and need assignment to users
            </div>
          )}
          
          <div className="row">
            {Object.entries(devices).map(([deviceId, device]) => (
              <DeviceCard key={deviceId} device={device} deviceId={deviceId} />
            ))}
            
            {Object.keys(devices).length === 0 && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  No device data available. Polling for device connections...
                  <br />
                  <small>System polls for device data every 10 seconds</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="row">
        <div className="col-12">
          <h3 className="mb-3">
            <i className="fas fa-users text-primary me-2"></i>
            System Users ({users.length})
          </h3>
          
          <div className="row">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
            
            {users.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  No users found. Please add users to assign dosimeters.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Data Modal */}
      {showUserModal && selectedUserForModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  {selectedUserForModal.name}'s Dosimeter Data
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeUserModal}
                ></button>
              </div>
              
              <div className="modal-body">
                {/* User Info */}
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <strong>Email:</strong> {selectedUserForModal.email}
                      </div>
                      <div className="col-md-4">
                        <strong>Phone:</strong> {selectedUserForModal.phoneNo}
                      </div>
                      <div className="col-md-4">
                        <strong>Gender:</strong> {selectedUserForModal.sex}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts Section */}
                {userAlerts.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-danger">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      High Radiation Alerts ({userAlerts.length})
                    </h6>
                    <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <table className="table table-sm table-striped">
                        <thead className="table-dark">
                          <tr>
                            <th>Device</th>
                            <th>CPM</th>
                            <th>µSv/h</th>
                            <th>Level</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userAlerts.slice(0, 10).map(alert => {
                            const level = getRadiationLevel(alert.cpm);
                            const microsievert = (alert.cpm * 0.0057).toFixed(3);
                            return (
                              <tr key={alert.id} className="table-danger">
                                <td>{alert.deviceId}</td>
                                <td><strong>{alert.cpm}</strong></td>
                                <td>{microsievert}</td>
                                <td>
                                  <span className={`badge bg-${level.color}`}>
                                    {level.level}
                                  </span>
                                </td>
                                <td>{new Date(alert.timestamp).toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Recent Readings */}
                <div>
                  <h6>
                    <i className="fas fa-chart-line me-2"></i>
                    All Readings ({userReadings.length} total)
                  </h6>
                  <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-sm table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>Device</th>
                          <th>CPM</th>
                          <th>µSv/h</th>
                          <th>Level</th>
                          <th>Timestamp</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userReadings.slice(0, 50).map(reading => {
                          const level = getRadiationLevel(reading.cpm || 0);
                          const microsievert = ((reading.cpm || 0) * 0.0057).toFixed(3);
                          return (
                            <tr key={reading.id} className={reading.alertTriggered ? 'table-warning' : ''}>
                              <td>{reading.deviceId}</td>
                              <td>{reading.cpm || 'N/A'}</td>
                              <td>{microsievert}</td>
                              <td>
                                <span className={`badge bg-${level.color}`}>
                                  {level.level}
                                </span>
                              </td>
                              <td>{new Date(reading.timestamp).toLocaleString()}</td>
                              <td>
                                {reading.alertTriggered && (
                                  <span className="badge bg-danger">ALERT</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleExportUserCsv(selectedUserForModal.id)}
                >
                  <i className="fas fa-download me-1"></i>
                  Export Full Data CSV
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeUserModal}
                >
                  Close
                </button> 
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;