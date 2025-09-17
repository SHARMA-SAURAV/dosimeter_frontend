// import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import { getActiveDevices, getStoppedDevices, getDeviceData } from './services/api';

// import Dashboard from './Pages/Dashboard';
// // import { startSimulator } from './dev-simulator';
// // import Navbar from './components/Navbar';
// import Login from './components/Login';
// import Register from './Pages/Register';
// // import { Navbar } from 'react-bootstrap';
// import Navbar from './components/Navbar';
// import DashboardPage from './Pages/DashboardPage';

// const App = () => {
  

//   return(
//   <>
//   <BrowserRouter>
//   <Navbar />
//     <Routes>
       
//       <Route path="/" element={<Login />} />
//       <Route path="/login" element={<Login />} />
      
//       <Route path="/register" element={<Register />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Routes>
//   </BrowserRouter>

  
//     {/* <Login /> */}
    
//   </>
//   )

// };

// export default App;




import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/DashboardPage';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;