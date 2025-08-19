import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { getActiveDevices, getStoppedDevices, getDeviceData } from './services/api';

import Dashboard from './Pages/Dashboard';
// import { startSimulator } from './dev-simulator';
// import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './Pages/Register';
// import { Navbar } from 'react-bootstrap';
import Navbar from './components/Navbar';
import DashboardPage from './Pages/DashboardPage';

const App = () => {
  // const [dosimeterData, setDosimeterData] = useState({});
  // const [stoppedDevices, setStoppedDevices] = useState({});

  // // Start simulator (only in development)
  // useEffect(() => {
  //   startSimulator(); // remove in production
  // }, []);

  // // Polling every 2 seconds
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const { data: activeIds } = await getActiveDevices();
  //       const { data: stoppedIds } = await getStoppedDevices();

  //       const newData = {};
  //       for (const id of activeIds) {
  //         const res = await getDeviceData(id);
  //         newData[id] = res.data.slice(-30); // Keep last 30 entries
  //       }

  //       setDosimeterData(newData);

  //       const stoppedMap = {};
  //       stoppedIds.forEach(id => stoppedMap[id] = true);
  //       setStoppedDevices(stoppedMap);

  //     } catch (err) {
  //       console.error('Backend error:', err.message);
  //     }
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  return(
  <>
  <BrowserRouter>
  <Navbar />
    <Routes>
       
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/dashboard" element={<Dashboard dosimeterData={dosimeterData} stoppedDevices={stoppedDevices} />} /> */}
     
    {/* <Dashboard path="/Dashboard" dosimeterData={dosimeterData} stoppedDevices={stoppedDevices} />; */}
    </Routes>
  </BrowserRouter>

  
    {/* <Login /> */}
    
  </>
  )

};

export default App;
