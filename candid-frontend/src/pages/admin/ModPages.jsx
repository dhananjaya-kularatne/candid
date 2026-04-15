import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import useConfirm from '../../components/useConfirm';

export const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, confirmModal] = useConfirm();

  const fetchReports = () => {
    API.get('/admin/reports')
      .then(res => setReports(res.data.content || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDismiss = async (id) => {
    try {
      await API.put(`/admin/reports/${id}/dismiss`);
      fetchReports();
    } catch (err) { console.error(err); }
  };

  const handleDeletePost = async (id) => {
    const ok = await confirm({
      message: 'Delete the reported post?',
      subMessage: 'The post will be permanently removed.',
      confirmLabel: 'Delete Post',
      confirmDanger: true,
    });
    if (!ok) return;
    try {
      await API.put(`/admin/reports/${id}/delete-post`);
      fetchReports();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="card overflow-hidden">
      {confirmModal}
      <div className="p-4 border-b border-[#e5e5e5]">
        <h3 className="text-sm font-medium text-[#1a1a1a]">Reported Content</h3>
      </div>
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="bg-[#f9fafb] text-[#6b7280] font-normal border-b border-[#e5e5e5]">
            <th className="px-6 py-3 font-medium">Reporter</th>
            <th className="px-6 py-3 font-medium">Post Preview</th>
            <th className="px-6 py-3 font-medium">Reason</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e5e5]">
          {loading ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-[#9ca3af]">Loading...</td></tr>
          ) : reports.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-[#9ca3af]">No active reports.</td></tr>
          ) : (
            reports.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-[#6b7280]">@{r.reporter?.username}</td>
                <td className="px-6 py-4 text-[#6b7280] max-w-[200px] truncate">{r.post?.content}</td>
                <td className="px-6 py-4 text-[#6b7280]">{r.reason || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    r.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                    r.status === 'DISMISSED' ? 'bg-gray-100 text-gray-500' :
                    'bg-red-50 text-red-600'
                  }`}>{r.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-[11px] font-medium text-[#7F77DD]" onClick={() => handleDismiss(r.id)}>Dismiss</button>
                    <button className="text-[11px] font-medium text-red-500" onClick={() => handleDeletePost(r.id)}>Delete Post</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const HashtagsManagement = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/hashtags/trending')
      .then(res => setTrending(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-[#e5e5e5]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="text-sm font-medium text-[#1a1a1a]">Trending Hashtags</h3>
        <span style={{ fontSize: 12, color: '#8a8d91' }}>Auto-detected · updated live</span>
      </div>
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="bg-[#f9fafb] text-[#6b7280] font-normal border-b border-[#e5e5e5]">
            <th className="px-6 py-3 font-medium">Rank</th>
            <th className="px-6 py-3 font-medium">Hashtag</th>
            <th className="px-6 py-3 font-medium">Posts (last 24h)</th>
            <th className="px-6 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e5e5]">
          {loading ? (
            <tr><td colSpan="4" className="px-6 py-8 text-center text-[#9ca3af]">Loading...</td></tr>
          ) : trending.length === 0 ? (
            <tr><td colSpan="4" className="px-6 py-8 text-center text-[#9ca3af]">No hashtags used yet.</td></tr>
          ) : (
            trending.map((h, i) => (
              <tr key={h.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-[#6b7280]">#{i + 1}</td>
                <td className="px-6 py-4 font-medium text-[#534AB7]">#{h.name}</td>
                <td className="px-6 py-4 text-[#1a1a1a]">{h.postCount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 11,
                    background: i < 5 ? '#EEEDFE' : '#f3f4f6',
                    color: i < 5 ? '#534AB7' : '#6b7280',
                  }}>
                    {i < 5 ? 'Trending' : 'Rising'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ padding: '10px 24px', fontSize: 12, color: '#8a8d91', borderTop: '1px solid #e5e5e5' }}>
        Trending is determined automatically by post frequency. Top 5 appear in the sidebar.
      </div>
    </div>
  );
};
