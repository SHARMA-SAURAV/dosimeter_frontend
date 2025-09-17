// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Navbar() {
//   const navigate = useNavigate();
//   const email = localStorage.getItem('email');

//   const handleLogout = () => {
//     localStorage.removeItem('email');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div
//       className="navbar px-4 py-3 shadow-sm"
//       style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd' }}
//     >
//       {/* Title and Subtitle */}
//       <div>
//         <h1 style={{ color: '#0070E0', fontSize: '28px', marginBottom: '4px' }}>
//           Dosimeter Monitoring Dashboard
//         </h1>
//         <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
//           Monitoring radiation levels across multiple dosimeter devices in real-time
//         </p>
//       </div>

//       {/* Right section (auth info) */}
//       <div className="d-flex align-items-center ms-auto">
//         {email && (
//           <>
//             <span className="me-3 fw-semibold text-dark">Hello, {email}</span>

//             <button
//               className="btn btn-outline-primary btn-sm me-2"
//               onClick={() => navigate('/dashboard')}
//             >
//               Dashboard
//             </button>

//             <button
//               className="btn btn-primary btn-sm"
//               style={{ fontWeight: '500', borderRadius: '6px' }}
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Navbar;

























import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid px-4">
        {/* Brand/Title */}
        <div className="navbar-brand">
          <div className="d-flex align-items-center">
            <i className="fas fa-radiation text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <h4 className="mb-0 text-primary">Dosimeter Monitoring Dashboard</h4>
              <small className="text-muted">Real-time radiation level monitoring system</small>
            </div>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="navbar-nav ms-auto">
          <div className="nav-item dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user me-2"></i>
              {email}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;