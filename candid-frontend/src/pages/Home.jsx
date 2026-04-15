import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComposeBox, PostCard } from '../components/Post';
import PostModal from '../components/post/PostModal';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openPost, setOpenPost] = useState(null);
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchPosts = useCallback(async (pageNum = 0) => {
    try {
      const endpoint = user ? `/posts/feed?page=${pageNum}` : `/posts/public?page=${pageNum}`;
      const res = await API.get(endpoint);
      const data = res.data;
      const content = data.content ?? data;
      if (pageNum === 0) {
        setPosts(content);
      } else {
        setPosts(prev => [...prev, ...content]);
      }
      if (data.last !== undefined) setHasMore(!data.last);
    } catch (err) {
      console.error('Failed to fetch feed', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // Open post modal when navigated from a notification (?post=<id>)
  useEffect(() => {
    const postId = searchParams.get('post');
    if (!postId || !user) return;
    API.get(`/posts/${postId}`)
      .then(res => setOpenPost(res.data))
      .catch(() => {});
    // Remove the query param without re-rendering the whole page
    setSearchParams({}, { replace: true });
  }, [searchParams, user]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <div className="flex flex-col gap-3">
      {user && <ComposeBox onPostCreated={handlePostCreated} />}

      {!user && (
        <div style={{
          background: '#fff', borderRadius: 8, padding: '16px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#050505' }}>Welcome to Candid</div>
            <div style={{ fontSize: 13, color: '#65676b', marginTop: 2 }}>A place for your daily blogs and random thoughts. Log in to start writing.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/login" style={{
              padding: '7px 16px', borderRadius: 6,
              background: '#7F77DD', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-block',
            }}>Log in</a>
            <a href="/register" style={{
              padding: '7px 16px', borderRadius: 6,
              background: '#EEEDFE', color: '#534AB7', border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-block',
            }}>Sign up</a>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8 text-[#9ca3af]">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center text-[#9ca3af]">
          No posts yet.{user && <> Follow people or <span
            className="text-[#7F77DD] cursor-pointer"
            onClick={() => window.location.href = '/discover'}
          >discover</span> new ones!</>}
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
          {hasMore && (
            <button
              className="text-[13px] text-[#7F77DD] text-center py-3"
              onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
            >
              Load more
            </button>
          )}
        </>
      )}

      {/* Post modal opened from notification */}
      {openPost && (
        <PostModal
          post={openPost}
          onClose={() => setOpenPost(null)}
          onLike={async (e) => {
            e.stopPropagation();
            try {
              if (openPost.liked) {
                await API.delete(`/posts/${openPost.id}/like`);
                setOpenPost(p => ({ ...p, liked: false, likesCount: p.likesCount - 1 }));
              } else {
                await API.post(`/posts/${openPost.id}/like`);
                setOpenPost(p => ({ ...p, liked: true, likesCount: p.likesCount + 1 }));
              }
            } catch {}
          }}
          onDelete={() => { handleDelete(openPost.id); setOpenPost(null); }}
        />
      )}
    </div>
  );
};

export default Home;
