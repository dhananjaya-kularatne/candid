import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Navigation';
import RightPanel from './RightPanel';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const { loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ width: '100%', maxWidth: 620, margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
      <RightPanel />
    </div>
  );
};

export default MainLayout;
