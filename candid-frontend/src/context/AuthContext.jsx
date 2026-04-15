import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AuthContext = createContext();

/* ── Auth Gate Modal (shown when guests try to interact) ── */
const AuthGateModal = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 16,
          padding: '32px 28px 24px',
          width: '100%', maxWidth: 360,
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Logo */}
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
          <span style={{ color: '#050505' }}>Cand</span>
          <span style={{ color: '#7F77DD' }}>id</span>
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: '#050505', marginBottom: 6 }}>
          Join Candid to continue
        </div>
        <p style={{ fontSize: 14, color: '#65676b', lineHeight: 1.5, marginBottom: 24, marginTop: 0 }}>
          Log in or create an account to write your daily blog, share your thoughts, and follow other writers.
        </p>

        <button
          onClick={() => { onClose(); navigate('/login'); }}
          style={{
            width: '100%', padding: '11px 0', borderRadius: 8,
            background: '#7F77DD', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            marginBottom: 10, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#6c65cc'}
          onMouseLeave={e => e.currentTarget.style.background = '#7F77DD'}
        >
          Log in
        </button>

        <button
          onClick={() => { onClose(); navigate('/register'); }}
          style={{
            width: '100%', padding: '11px 0', borderRadius: 8,
            background: '#EEEDFE', color: '#534AB7', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            marginBottom: 16, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#dddcfb'}
          onMouseLeave={e => e.currentTarget.style.background = '#EEEDFE'}
        >
          Create account
        </button>

        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, color: '#8a8d91', padding: 0,
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  // Shared follow state: username -> 'following' | 'requested' | null
  const [followMap, setFollowMap] = useState({});
  const updateFollow = (username, status) =>
    setFollowMap(prev => ({ ...prev, [username]: status }));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const triggerAuthGate = () => setAuthGateOpen(true);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, triggerAuthGate, followMap, updateFollow }}>
      {children}
      {authGateOpen && <AuthGateModal onClose={() => setAuthGateOpen(false)} />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
