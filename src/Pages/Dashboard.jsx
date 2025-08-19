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





import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Assuming axios instance
import DosimeterCard from '../components/DosimeterCard'; // Adjust path as needed
// import { Button } from "@/components/ui/button"; // Create this if not exist

const Dashboard = () => {
  const [dosimeterData, setDosimeterData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Only fetch if token exists
    const token = localStorage.getItem('token');
    if (!token) return;
    fetchDosimeterData();
    const interval = setInterval(() => {
      fetchDosimeterData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  //add this const to a condition like if token is null not run this 
  const fetchDosimeterData = async () => {
    try {
      const res = await api.get("/get/json");
      console.log("Dosimeter Data:", res.data);
      setDosimeterData(res.data);
    } catch (err) {
      setMessage("Error fetching data");
    }
  };

  const handleAssign = async () => {
    try {
      const res = await api.post('/dosimeter/assign', {
        deviceId: dosimeterData.deviceId,
        userId: localStorage.getItem('userId'),
      });
      setMessage(res.data);
      fetchDosimeterData(); // Refresh data
    } catch (err) {
      setMessage("Assignment failed");
    }
  };

  const downloadJson = () => {
    window.open(`/download/json/${dosimeterData.deviceId}`, '_blank');
  };

  const downloadCsv = () => {
    window.open(`/download/csv/${dosimeterData.deviceId}`, '_blank');
  };

  return (
    <div className="p-4">
      
      <h2>Dosimeter Dashboard</h2>
      {message && <p>{message}</p>}

      {dosimeterData ? (
        <div className="border p-3">
          {console.log("Dosimeter Data:", dosimeterData)}
      <DosimeterCard deviceId={dosimeterData.deviceId} data ={dosimeterData} isStopper={dosimeterData.status} />
          <p><strong>Device ID:</strong> {dosimeterData.deviceId}</p>
          <p><strong>Status:</strong> {dosimeterData.status}</p>

          {dosimeterData.assigned ? (
            <p className="text-green-600">Assigned to you</p>
          ) : (
            <button  onClick={handleAssign}>Assign </button>
          )}

          {dosimeterData.status === 'inactive' && (
            <div className="mt-3 space-x-2">
              <button onClick={downloadJson}>Download JSON</button>
              <button onClick={downloadCsv}>Download CSV</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading dosimeter data...</p>
      )}
    </div>
  );
};

export default Dashboard;
