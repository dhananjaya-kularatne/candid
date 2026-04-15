import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { PostCard } from '../components/Post';

const HashtagPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setPosts([]);
    setPage(0);
    fetchPosts(0);
  }, [tag]);

  const fetchPosts = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/hashtag/${encodeURIComponent(tag)}?page=${pageNum}`);
      const data = res.data;
      const content = data.content ?? data;
      if (pageNum === 0) {
        setPosts(content);
      } else {
        setPosts(prev => [...prev, ...content]);
      }
      setHasMore(data.last === false);
    } catch (err) {
      console.error('Hashtag fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280', lineHeight: 1 }}
        >
          ←
        </button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>#{tag}</div>
          {!loading && (
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{posts.length} post{posts.length !== 1 ? 's' : ''}</div>
          )}
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
          No posts tagged #{tag} yet.
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={() => setPosts(prev => prev.filter(p => p.id !== post.id))} />
          ))}

          {hasMore && (
            <button
              onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#7F77DD', fontSize: 13, padding: '8px 0', textAlign: 'center',
              }}
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default HashtagPage;
