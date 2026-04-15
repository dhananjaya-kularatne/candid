import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { timeAgo } from '../../utils/dateUtils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/posts?page=0'),
      API.get('/admin/users?page=0'),
    ]).then(([statsRes, postsRes, usersRes]) => {
      setStats(statsRes.data);
      setRecentPosts((postsRes.data.content || postsRes.data).slice(0, 5));
      setRecentUsers((usersRes.data.content || usersRes.data).slice(0, 5));
    }).catch(err => console.error('Dashboard failed', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-[#9ca3af] p-4">Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥' },
    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: '📝' },
    { label: 'Posts Today', value: stats?.postsToday || 0, icon: '📅' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="card p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6b7280]">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <span className={`text-2xl font-semibold ${stat.alert ? 'text-[#D85A30]' : 'text-[#1a1a1a]'}`}>
              {stat.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Recent activity — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Latest posts */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e5e5]">
            <h3 className="text-sm font-medium text-[#1a1a1a]">Latest Posts</h3>
          </div>
          {recentPosts.length === 0 ? (
            <p className="p-4 text-sm text-[#9ca3af]">No posts yet.</p>
          ) : (
            <div className="divide-y divide-[#f3f4f6]">
              {recentPosts.map(post => (
                <div key={post.id} className="px-4 py-3 flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#1a1a1a]">@{post.user?.username}</span>
                      <span className="text-[11px] text-[#9ca3af]">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="text-[12px] text-[#6b7280] mt-0.5 truncate">
                      {post.content || <span className="italic">Image post</span>}
                    </p>
                  </div>
                  <div className="text-[11px] text-[#9ca3af] whitespace-nowrap">
                    {post.likesCount}L · {post.commentsCount}C
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest users */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e5e5]">
            <h3 className="text-sm font-medium text-[#1a1a1a]">Latest Users</h3>
          </div>
          {recentUsers.length === 0 ? (
            <p className="p-4 text-sm text-[#9ca3af]">No users yet.</p>
          ) : (
            <div className="divide-y divide-[#f3f4f6]">
              {recentUsers.map(user => (
                <div key={user.username} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#1a1a1a] truncate">{user.name}</div>
                    <div className="text-[11px] text-[#9ca3af]">@{user.username}</div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : user.status === 'BANNED'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-50 text-green-600'
                  }`}>
                    {user.role === 'ADMIN' ? 'Admin' : user.status === 'BANNED' ? 'Banned' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
