import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className="navbar px-4 py-3 shadow-sm"
      style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd' }}
    >
      {/* Title and Subtitle */}
      <div>
        <h1 style={{ color: '#0070E0', fontSize: '28px', marginBottom: '4px' }}>
          Dosimeter Monitoring Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
          Monitoring radiation levels across multiple dosimeter devices in real-time
        </p>
      </div>

      {/* Right section (auth info) */}
      <div className="d-flex align-items-center ms-auto">
        {email && (
          <>
            <span className="me-3 fw-semibold text-dark">Hello, {email}</span>

            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <button
              className="btn btn-primary btn-sm"
              style={{ fontWeight: '500', borderRadius: '6px' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
