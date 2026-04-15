import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setStep('otp');
      setSuccess('OTP sent to ' + email + '. Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, otp, newPassword });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div className="card w-full p-8 mx-4 shadow-sm" style={{ maxWidth: 400 }}>
        <div className="text-center mb-8">
          <h1 className="logo-text text-2xl font-medium mb-2">
            <span className="logo-cand">Cand</span>
            <span className="logo-id">id</span>
          </h1>
          <p className="text-[#6b7280]">
            {step === 'email' && 'Reset your password'}
            {step === 'otp' && 'Enter your OTP'}
            {step === 'done' && 'Password reset!'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Email address</label>
              <input
                type="email"
                className="input-base"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            {success && <p className="text-[#7F77DD] text-xs bg-[#EEEDFE] rounded p-2">{success}</p>}
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">OTP Code</label>
              <input
                type="text"
                className="input-base"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">New Password</label>
              <input
                type="password"
                className="input-base"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Confirm Password</label>
              <input
                type="password"
                className="input-base"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
              className="text-[#9ca3af] text-sm text-center w-full"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Back
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center flex flex-col gap-4">
            <div style={{ fontSize: 40 }}>✅</div>
            <p className="text-[#1a1a1a] font-medium">Your password has been reset!</p>
            <button className="btn-primary w-full" onClick={() => navigate('/login')}>
              Log in
            </button>
          </div>
        )}

        {step !== 'done' && (
          <p className="text-center text-[#6b7280] text-sm mt-6">
            Remember your password? <Link to="/login" className="text-[#7F77DD] font-medium">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
