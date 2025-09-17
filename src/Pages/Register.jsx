// import { useState } from "react";
// import api from "../services/api"; // Adjust the import path as necessary



// function Register() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     sex: 'MALE',
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setError('');//   Clear error on input change

//     if (name === "phone") {
//       // 1. Remove any non-digit characters
//       const cleanedValue = value.replace(/\D/g, '');
//       // 2. Limit to a maximum of 10 digits as the user types
//       const truncatedValue = cleanedValue.slice(0, 10);
//       setForm((prev) => ({ ...prev, [name]: truncatedValue }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateForm = () => {
//     if (!form.name || !form.email || !form.password || !form.phone || !form.sex) {
//       return ('All fields are required.');
//       // return false;
//     }
//     if (!/^[a-zA-Z\s]+$/.test(form.name)) {
//       return ('Name can only contain letters and spaces.');
//       // return false;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       return ('Invalid email format.');
//       // return false;
//     }
//     if (form.password.length < 6) {
//       return ('Password must be at least 6 characters long.');
//       // return false;
//     }
//     if (!/^\d{10}$/.test(form.phone)) {
//       return ('Phone number must be exactly 10 digits.');
//       // return false;
//     }
//     return "";
//   };
//   // Handle form submission
//   // This function will be called when the form is submitted
//   // It will prevent the default form submission behavior and handle the registration logic
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }
//     setLoading(true);
//     try {
//       await api.post('/auth/register', form);
//       alert("User Registered Sucessfully");
//       setForm({
//         name: '',
//         email: '',
//         password: '',
//         phone: '',
//         sex: 'MALE',
//       });


//     }
//     catch (err) {
//       if (err.response?.data?.includes("Exists")) {
//         setError('Already exists! Please use a different email.');
//       }
//       else {
//         setError(err.response?.data?.message || 'Registration failed. Please try again.');
//       }
//     }
//     finally {
//       setLoading(false);
//     }
//   }


//   return (
//     <div className="container my-5">
//       <div className="card shadow p-4 mx-auto" style={{ maxWidth: '700px', borderRadius: '16px' }}>

//         <h4 className="mb-4 text-center text-primary">
//           <i className="fas fa-user-plus me-2"></i>
//           Create Account
//         </h4>

//         {error && <div className="alert alert-danger">{error}</div>}
//         <form onSubmit={handleSubmit}>

//           <div className="col-md-6 mb-3" style={{ width: "645px" }}>
//             <label htmlFor="name" className="form-label">Full Name</label>
//             <input

//               id="name"
//               name="name"
//               className="form-control"
//               value={form.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter Your Full Name"
//             />
//           </div>
//             <div className="col-md-6 mb-3" style={{ width: "645px" }}>
//               <label htmlFor="email" className="form-label">Email</label>
//               <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required placeholder="Enter Your Emial" />
//             </div>
//             <div className="col-md-6 mb-3" style={{ width: "645px" }}>
//               <label htmlFor="password" className="form-label">Password</label>
//               <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required  placeholder="Enter Your Password"/>
//             </div>
//             <div className="col-md-6 mb-3" style={{ width: "645px" }}>
//               <label htmlFor="phone" className="form-label">Phone Number</label>
//               <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
//             </div>
//             <div className="col-md-6 mb-3" style={{ width: "645px" }}>
//               <label htmlFor="Sex" className="form-label">  Sex</label>
//               <select name="sex" id="sex" className="sex" value={form.sex} onChange={handleChange}  style={{ width: "100px", marginLeft: "20px" }} required>
//                 <option value="MALE"> MALE</option>
//                 <option value="FEMALE"> FEMALE</option>
//                 <option value="OTHER"> OTHER</option>
//               </select>
//             </div>
//             <div className="col-md-6 mb-3" style={{ width: "179px" , marginLeft: "230px" }}>
//               <button type="submit" className="btn"
//                 style={{
//                   backgroundColor: '#0d6efd',
//                   color: '#fff',
//                   fontWeight: '500',
//                   borderRadius: '8px',
//                 }}
//                 disabled={loading}
//               >

//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2"></span>
//                     Creating Account...
//                   </>

//                 ) : (
//                   <>
//                     <i className="fas fa-user-plus me-2"> </i>
//                     Create Account
//                   </>

//                 )}
//               </button>
//             </div>
//         </form>
//       </div>
//     </div>


//   );
// }
// export default Register;





















import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    sex: 'MALE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(''); // Clear error on input change

    if (name === "phoneNo") {
      // Remove non-digit characters and limit to 10 digits
      const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, [name]: cleanedValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.phoneNo || !form.sex) {
      return 'All fields are required.';
    }
    if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      return 'Name can only contain letters and spaces.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Invalid email format.';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!/^\d{10}$/.test(form.phoneNo)) {
      return 'Phone number must be exactly 10 digits.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(form);
      alert('User registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.includes("already exists") || err.response?.status === 409) {
        setError('Email already exists! Please use a different email.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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
          maxWidth: '500px',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="text-center mb-4">
          <i
            className="fa-solid fa-user-plus fa-3x"
            style={{ color: 'rgb(13, 110, 253)' }}
          ></i>
          <h2 className="mt-2" style={{ color: '#333' }}>
            Create Account
          </h2>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Join the dosimeter monitoring system
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                className="form-control"
                value={form.phoneNo}
                onChange={handleChange}
                required
                placeholder="10-digit phone number"
                disabled={loading}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Gender</label>
              <select
                name="sex"
                className="form-select"
                value={form.sex}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
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
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </>
            )}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-decoration-none">
              <small style={{ color: 'rgb(13, 110, 253)' }}>
                Already have an account? Sign In
              </small>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
