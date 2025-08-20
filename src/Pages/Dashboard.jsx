// import React from 'react';
// import DosimeterCard from '../components/DosimeterCard';
// import RadiationChart from '../components/RadiationChart';
// // import DosimeterCard from './DosimeterCard';
// // import RadiationChart from './RadiationChart';

import DosimeterSection from "../components/DosimeterSection";

// const Dashboard = ({ dosimeterData, stoppedDevices }) => (
//   <div className="container my-4">
//     {/* <h2 className="mb-4">Dosimeter Monitoring Dashboard</h2> */}
//     <div className="row">
//       <div className="col-md-4">
//         {Object.entries(dosimeterData).map(([id, data]) => (
//           <DosimeterCard
//             key={id}
//             deviceId={id}
//             data={data}
//             isStopped={stoppedDevices[id]}
//           />
//         ))}
//       </div>
//       <div className="col-md-8">
//         <RadiationChart dosimeterData={dosimeterData} />
//       </div>
//     </div>
//   </div>
// );


// export default Dashboard;





// import React, { useEffect, useState } from 'react';
// import api from '../services/api'; // Assuming axios instance
// import DosimeterCard from '../components/DosimeterCard'; // Adjust path as needed
// // import { Button } from "@/components/ui/button"; // Create this if not exist

// const Dashboard = () => {
//   const [dosimeterData, setDosimeterData] = useState(null);
//   const [message, setMessage] = useState('');
//   const [dosimeters, setDosimeters] = useState({});

//   useEffect(() => {
//     // Only fetch if token exists
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     fetchDosimeterData();
//     const interval = setInterval(() => {
//       fetchDosimeterData();
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);



//   const fetchDosimeterData = async () => {
//   try {
//     const res = await api.get("/get/json");
//     const data = res.data;

//     setDosimeters(prev => ({
//       ...prev,
//       [data.deviceId]: data  // update or add new dosimeter by ID
//     }));
//   } catch (err) {
//     setMessage("Error fetching data");
//   }
// };

//   // //add this const to a condition like if token is null not run this 
//   // const fetchDosimeterData = async () => {
//   //   try {
//   //     const res = await api.get("/get/json");
//   //     console.log("Dosimeter Data:", res.data);
//   //     setDosimeterData(res.data);
//   //   } catch (err) {
//   //     setMessage("Error fetching data");
//   //   }
//   // };

//   // const handleAssign = async () => {
//   //   try {
//   //     const res = await api.post('/dosimeter/assign', {
//   //       deviceId: dosimeterData.deviceId,
//   //       userId: localStorage.getItem('userId'),
//   //     });
//   //     setMessage(res.data);
//   //     fetchDosimeterData(); // Refresh data
//   //   } catch (err) {
//   //     setMessage("Assignment failed");
//   //   }
//   // };





//   const handleAssign = async (deviceId) => {
//   try {
//     const res = await api.post('/assignments/assign', {
//       deviceId,
//       userId: localStorage.getItem('userId'),
//     });
//     setMessage(res.data);
//     fetchDosimeterData();
//   } catch (err) {
//     setMessage("Assignment failed");
//   }
// };

// const downloadJson = (deviceId) => {
//   window.open(`/download/json/${deviceId}`, '_blank');
// };

// const downloadCsv = (deviceId) => {
//   window.open(`/download/csv/${deviceId}`, '_blank');
// };


//   // const downloadJson = () => {
//   //   window.open(`/download/json/${dosimeterData.deviceId}`, '_blank');
//   // };

//   // const downloadCsv = () => {
//   //   window.open(`/download/csv/${dosimeterData.deviceId}`, '_blank');
//   // };

//   return (
//   <div className="p-4">
//     <h2>Dosimeter Dashboard</h2>
//     {message && <p>{message}</p>}

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {Object.values(dosimeters).map(d => (
//         <div key={d.deviceId} className="border p-3">
//           <DosimeterCard deviceId={d.deviceId} data={d} isStopper={d.status} />

//           <p><strong>Device ID:</strong> {d.deviceId}</p>
//           <p><strong>Status:</strong> {d.status}</p>

//           {d.assigned ? (
//             <p className="text-green-600">Assigned to you</p>
//           ) : (
//             <button onClick={() => handleAssign(d.deviceId)}>Assign</button>
//           )}

//           {d.status === 'inactive' && (
//             <div className="mt-3 space-x-2">
//               <button onClick={() => downloadJson(d.deviceId)}>Download JSON</button>
//               <button onClick={() => downloadCsv(d.deviceId)}>Download CSV</button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// };

// export default Dashboard;














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
