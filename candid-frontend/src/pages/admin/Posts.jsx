import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Avatar } from '../../components/Navigation';
import useConfirm from '../../components/useConfirm';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [preview, setPreview] = useState(null); // full image preview
  const [confirm, confirmModal] = useConfirm();

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const fetchPosts = async (pageNum = 0) => {
    if (pageNum === 0) setLoading(true); else setLoadingMore(true);
    try {
      const res = await API.get(`/admin/posts?page=${pageNum}`);
      const data = res.data;
      const content = data.content || data;
      if (pageNum === 0) {
        setPosts(content);
      } else {
        setPosts(prev => [...prev, ...content]);
      }
      setHasMore(data.last === false);
      setPage(pageNum);
    } catch (err) {
      console.error('Posts fetch failed', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      message: 'Delete this post?',
      subMessage: 'This will permanently remove the post.',
      confirmLabel: 'Delete',
      confirmDanger: true,
    });
    if (!ok) return;
    try {
      await API.delete(`/admin/posts/${id}`);
      fetchPosts(0);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="card overflow-hidden">
      {confirmModal}

      {/* Image preview overlay */}
      {preview && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="preview" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 8, objectFit: 'contain' }} />
        </div>
      )}

      <div className="p-4 border-b border-[#e5e5e5]">
        <h3 className="text-sm font-medium text-[#1a1a1a]">Posts Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-[#f9fafb] text-[#6b7280] font-normal border-b border-[#e5e5e5]">
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Images</th>
              <th className="px-4 py-3 font-medium">Content Preview</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Stats</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#9ca3af]">Loading posts...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#9ca3af]">No posts found.</td></tr>
            ) : posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar username={post.user?.username} avatarUrl={post.user?.avatarUrl} size={28} />
                    <div>
                      <div className="font-medium text-[#1a1a1a] text-[13px]">{post.user?.name}</div>
                      <div className="text-[11px] text-[#9ca3af]">@{post.user?.username} · ID: {post.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {(post.imageUrls || []).length > 0 ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {post.imageUrls.slice(0, 3).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="post img"
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: '1px solid #e5e5e5' }}
                          onClick={() => setPreview(url)}
                          title="Click to enlarge"
                        />
                      ))}
                      {post.imageUrls.length > 3 && (
                        <div style={{ width: 44, height: 44, borderRadius: 4, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#6b7280' }}>
                          +{post.imageUrls.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#d1d5db]">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-[#6b7280]" style={{ maxWidth: 240 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.content || <span className="text-[#d1d5db] italic">Image only</span>}
                  </div>
                </td>
                <td className="px-4 py-4 text-[#6b7280] whitespace-nowrap">
                  <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                  <div className="text-[10px] text-[#9ca3af]">{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="px-4 py-4 text-[#9ca3af] whitespace-nowrap">
                  {post.likesCount}L · {post.commentsCount}C
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    className="text-[11px] font-medium px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-4 text-center border-t border-[#e5e5e5]">
          <button
            onClick={() => fetchPosts(page + 1)}
            disabled={loadingMore}
            className="text-[13px] text-[#534AB7] font-medium disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
