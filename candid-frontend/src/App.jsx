import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import { NotificationsPage, BookmarksPage } from './pages/ActivityPages';
import Search from './pages/Search';
import HashtagPage from './pages/HashtagPage';
import PostPage from './pages/PostPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';
import CookiesPage from './pages/legal/CookiesPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/Users';
import PostManagement from './pages/admin/Posts';
import { HashtagsManagement } from './pages/admin/ModPages';
import Announcements from './pages/admin/Announcements';

/* Redirects guests to "/" and shows the auth gate modal */
const RequireAuth = () => {
  const { user, loading, triggerAuthGate } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      triggerAuthGate();
    }
  }, [loading, user]);

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />} />

      {/* Public layout — guests can view feed, discover, search */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tag/:tag" element={<HashtagPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />

        {/* Auth-required pages */}
        <Route element={<RequireAuth />}>
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="posts" element={<PostManagement />} />
        <Route path="hashtags" element={<HashtagsManagement />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
