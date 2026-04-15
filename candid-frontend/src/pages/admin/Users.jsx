import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Avatar } from '../../components/Navigation';
import useConfirm from '../../components/useConfirm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirm, confirmModal] = useConfirm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.content || res.data);
    } catch (err) {
      console.error('Users fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id, currentStatus) => {
    try {
      if (currentStatus === 'BANNED') {
        await API.put(`/admin/users/${id}/unban`);
      } else {
        await API.put(`/admin/users/${id}/ban`);
      }
      fetchUsers();
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      message: 'Delete this user?',
      subMessage: 'Their account and all posts will be permanently removed.',
      confirmLabel: 'Delete',
      confirmDanger: true,
    });
    if (!ok) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="card overflow-hidden">
      {confirmModal}
      <div className="p-4 border-b border-[#e5e5e5] flex justify-between items-center">
        <h3 className="text-sm font-medium text-[#1a1a1a]">Users Management</h3>
        <input 
          type="text" 
          placeholder="Search users..." 
          className="input-base !w-64 !py-1.5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-[#f9fafb] text-[#6b7280] font-normal border-b border-[#e5e5e5]">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {users.filter(u => u.username.includes(searchTerm) || u.email.includes(searchTerm)).map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <Avatar username={user.username} size={28} />
                  <div className="flex flex-col">
                    <span className="font-medium text-[#1a1a1a]">{user.name}</span>
                    <span className="text-[#9ca3af]">@{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#6b7280]">{user.email}</td>
                <td className="px-6 py-4 text-[#6b7280]">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    user.status === 'ACTIVE' ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-red-50 text-red-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      className={`text-[11px] font-medium px-3 py-1 rounded border ${
                        user.status === 'BANNED' ? 'border-[#AFA9EC] text-[#534AB7]' : 'border-red-200 text-red-600'
                      }`}
                      onClick={() => handleBan(user.id, user.status)}
                    >
                      {user.status === 'BANNED' ? 'Unban' : 'Ban'}
                    </button>
                    <button 
                      className="text-[11px] font-medium px-3 py-1 rounded border border-[#e5e5e5] text-[#6b7280]"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
