import React, { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  if (user?.role !== 'ADMIN') return <Navigate to="/" />;

  const navItems = [
    { label: 'Dashboard', path: '/admin', end: true },
    { label: 'Users', path: '/admin/users' },
    { label: 'Posts', path: '/admin/posts' },
    { label: 'Hashtags', path: '/admin/hashtags' },
    { label: 'Announcements', path: '/admin/announcements' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {showLogout && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '28px 28px 22px',
            width: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Log out of Candid?</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
              You can always log back in anytime.
            </div>
            <button
              onClick={() => { setShowLogout(false); logout(); }}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 8,
                background: '#7F77DD', color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Log out
            </button>
            <button
              onClick={() => setShowLogout(false)}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 8,
                background: '#f3f4f6', color: '#374151', border: 'none',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-[190px] fixed top-0 left-0 h-full bg-white border-r border-[#e5e5e5] flex flex-col">
        <div className="p-5 border-b border-[#e5e5e5] mb-2">
          <h1 className="logo-text text-[18px] font-medium">
            <span className="logo-cand">Candid</span>
            <span className="text-xs ml-1 text-[#7F77DD]">Admin</span>
          </h1>
        </div>
        <nav className="flex-1">
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[190px] p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-[#1a1a1a]">Management Console</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#6b7280]">
              Logged in as <span className="font-medium text-[#1a1a1a]">{user.name}</span>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="text-sm text-[#9ca3af] hover:text-red-500 transition-colors"
            >
              Log out
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
