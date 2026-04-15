import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-vh-100 bg-[#f5f5f5]" style={{ minHeight: '100vh' }}>
      <div className="card w-full max-w-[400px] p-8 mx-4 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="logo-text text-2xl font-medium mb-2">
            <span className="logo-cand">Cand</span>
            <span className="logo-id">id</span>
          </h1>
          <p className="text-[#6b7280]">Your daily blog. Your random thoughts.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Email</label>
            <input 
              type="email" 
              className="input-base" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Password</label>
            <input 
              type="password" 
              className="input-base" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-2">Log in</button>
          <p className="text-center mt-2">
            <Link to="/forgot-password" className="text-[#9ca3af] text-[13px]">Forgot password?</Link>
          </p>
        </form>

        <p className="text-center text-[#6b7280] text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-[#7F77DD] font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-vh-100 bg-[#f5f5f5]" style={{ minHeight: '100vh' }}>
      <div className="card w-full max-w-[400px] p-8 mx-4 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="logo-text text-2xl font-medium mb-2">
            <span className="logo-cand">Cand</span>
            <span className="logo-id">id</span>
          </h1>
          <p className="text-[#6b7280]">Your daily blog. Your random thoughts.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Full Name</label>
            <input 
              type="text" 
              className="input-base" 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Username</label>
            <input 
              type="text" 
              className="input-base" 
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Email</label>
            <input 
              type="email" 
              className="input-base" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Password</label>
            <input 
              type="password" 
              className="input-base" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-2">Create Account</button>
        </form>

        <p className="text-center text-[#6b7280] text-sm mt-6">
          Already have an account? <Link to="/login" className="text-[#7F77DD] font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};
