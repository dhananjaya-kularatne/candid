import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const AVATAR_PALETTES = [
  { bg: '#EEEDFE', text: '#534AB7' },
  { bg: '#E1F5EE', text: '#0F6E56' },
  { bg: '#FAECE7', text: '#993C1D' },
  { bg: '#E6F1FB', text: '#185FA5' },
  { bg: '#FBEAF0', text: '#993556' },
];

export const Avatar = ({ username, size = 32, avatarUrl }) => {
  const letter = username?.charAt(0).toUpperCase() || '?';
  const palette = AVATAR_PALETTES[(username?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: palette.bg,
        color: palette.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        fontSize: size <= 28 ? 11 : 12,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
};

const LogoutModal = ({ onConfirm, onCancel }) => createPortal(
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.55)',
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
        onClick={onConfirm}
        style={{
          width: '100%', padding: '9px 0', borderRadius: 8,
          background: '#7F77DD', color: '#fff', border: 'none',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}
      >
        Log out
      </button>
      <button
        onClick={onCancel}
        style={{
          width: '100%', padding: '9px 0', borderRadius: 8,
          background: '#f3f4f6', color: '#374151', border: 'none',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  </div>,
  document.body
);

const Sidebar = () => {
  const { user, logout, triggerAuthGate } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const fetch = () =>
      API.get('/notifications/count')
        .then(res => setUnreadCount(res.data.count ?? 0))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [user]);

  const publicNavItems = [
    { label: 'Home',     path: '/',         end: true,  icon: <HomeIcon /> },
    { label: 'Discover', path: '/discover', end: false, icon: <DiscoverIcon /> },
    { label: 'Search',   path: '/search',   end: false, icon: <SearchIcon /> },
  ];

  const authNavItems = [
    { label: 'Notifications', path: '/notifications', end: false, icon: <BellIcon /> },
    { label: 'Bookmarks',     path: '/bookmarks',     end: false, icon: <BookmarkIcon /> },
  ];

  return (
    <aside className="left-sidebar">
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setShowLogoutModal(false); logout(); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
      {/* Logo */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #e4e6eb' }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#050505' }}>Cand</span>
          <span style={{ color: '#7F77DD' }}>id</span>
        </div>
        <div style={{ fontSize: 11, color: '#8a8d91', marginTop: 1 }}>Your daily blog. Your thoughts.</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {publicNavItems.map(({ path, label, end, icon }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {icon}
            {label}
          </NavLink>
        ))}

        {/* Auth-required nav items */}
        {authNavItems.map(({ path, label, end, icon }) => {
          const isNotif = label === 'Notifications';
          const badgedIcon = isNotif && unreadCount > 0 ? (
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              {icon}
              <span style={{
                position: 'absolute', top: -5, right: -7,
                minWidth: 16, height: 16, borderRadius: 99,
                background: '#e53e3e', color: '#fff',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px', lineHeight: 1,
                boxShadow: '0 0 0 2px #fff',
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </span>
          ) : icon;

          return user ? (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => isNotif && setUnreadCount(0)}
            >
              {badgedIcon}
              {label}
            </NavLink>
          ) : (
            <button
              key={path}
              onClick={triggerAuthGate}
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {badgedIcon}
              {label}
            </button>
          );
        })}

        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ShieldIcon />
            Admin
          </NavLink>
        )}
      </nav>

      {/* Profile section (logged in) or Login/Register (guest) */}
      <div style={{ borderTop: '1px solid #e4e6eb', padding: '12px 14px' }}>
        {user ? (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 8px', borderRadius: 8, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onClick={() => navigate(`/profile/${user.username}`)}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f2f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Avatar username={user.username} avatarUrl={user.avatarUrl} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 12, color: '#65676b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{user.username}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowLogoutModal(true); }}
              title="Log out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#65676b', padding: 4, fontSize: 16, lineHeight: 1, borderRadius: 6 }}
            >
              ⏻
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, color: '#8a8d91', marginBottom: 4, lineHeight: 1.4 }}>
              Start your daily blog or share your thoughts.
            </div>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 8,
                background: '#7F77DD', color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#6c65cc'}
              onMouseLeave={e => e.currentTarget.style.background = '#7F77DD'}
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 8,
                background: '#EEEDFE', color: '#534AB7', border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#dddcfb'}
              onMouseLeave={e => e.currentTarget.style.background = '#EEEDFE'}
            >
              Start writing
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

/* SVG Icons */
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const DiscoverIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default Sidebar;
