

// 6. Enhanced Login.js with better error handling
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(form);
      const { token, email } = res.data;
      
      localStorage.setItem('email', email);
      localStorage.setItem('token', token);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e0f2ff, #f0f8ff)',
        padding: '2rem',
      }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: '100%',
          maxWidth: '430px',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="text-center mb-4">
          <i
            className="fa-solid fa-radiation fa-3x"
            style={{ color: 'rgb(13, 110, 253)' }}
          ></i>
          <h2 className="mt-2" style={{ color: '#333' }}>
            Dosimeter Login
          </h2>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Access your radiation monitoring dashboard
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="fas fa-envelope" style={{ color: 'rgb(13, 110, 253)' }}></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="fas fa-lock" style={{ color: 'rgb(13, 110, 253)' }}></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: 'rgb(13, 110, 253)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center mt-3">
            <Link to="/register" className="text-decoration-none">
              <small style={{ color: 'rgb(13, 110, 253)' }}>
                Don't have an account? Sign Up
              </small>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;