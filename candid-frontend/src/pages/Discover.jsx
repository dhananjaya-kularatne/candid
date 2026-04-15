import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/Post';
import { Avatar } from '../components/Navigation';
import API from '../api/axios';
import { timeAgo } from '../utils/dateUtils';

const GridCell = ({ post, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const hasImage = (post.imageUrls || []).length > 0;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        paddingBottom: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 4,
        background: hasImage ? '#000' : '#EEEDFE',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {hasImage ? (
          <img
            src={post.imageUrls[0]}
            alt="post"
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.2s',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 12,
            background: hovered ? '#dddcfb' : '#EEEDFE',
            transition: 'background 0.15s',
          }}>
            <p style={{
              fontSize: 13, color: '#534AB7', lineHeight: 1.5,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
              margin: 0, fontWeight: 400,
            }}>
              {post.content}
            </p>
          </div>
        )}

        {/* Hover overlay — only on image posts */}
        {hasImage && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.15s',
            pointerEvents: 'none',
          }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>♥ {post.likesCount}</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>◎ {post.commentsCount}</span>
          </div>
        )}

        {/* Stats on text posts when hovered */}
        {!hasImage && hovered && (
          <div style={{
            position: 'absolute', bottom: 6, left: 6, right: 6,
            display: 'flex', gap: 8, justifyContent: 'center',
          }}>
            <span style={{ fontSize: 11, color: '#534AB7', fontWeight: 600 }}>♥ {post.likesCount}</span>
            <span style={{ fontSize: 11, color: '#534AB7', fontWeight: 600 }}>◎ {post.commentsCount}</span>
          </div>
        )}

        {/* Multiple images indicator */}
        {(post.imageUrls || []).length > 1 && (
          <div style={{
            position: 'absolute', top: 6, right: 6,
            background: 'rgba(0,0,0,0.5)', borderRadius: 4,
            padding: '2px 5px', fontSize: 10, color: '#fff',
            pointerEvents: 'none',
          }}>
            +{post.imageUrls.length - 1}
          </div>
        )}
      </div>
    </div>
  );
};

const Discover = () => {
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'feed'
  const [initialPostId, setInitialPostId] = useState(null);
  const navigate = useNavigate();
  const { user, triggerAuthGate, followMap, updateFollow } = useAuth();

  useEffect(() => {
    if (viewMode === 'feed' && initialPostId) {
      // Small timeout to ensure DOM has rendered
      setTimeout(() => {
        const el = document.getElementById(`post-${initialPostId}`);
        if (el) {
          const yOffset = -80; 
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      }, 0);
    }
  }, [viewMode, initialPostId]);

  useEffect(() => {
    fetchPosts(0);
    if (user) {
      API.get('/users/suggested')
        .then(res => setSuggestions(res.data))
        .catch(() => {});
    }
  }, [user]);

  const fetchPosts = async (pageNum = 0) => {
    try {
      const endpoint = user
        ? `/posts/discover?page=${pageNum}`
        : `/posts/public?page=${pageNum}`;
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
      console.error('Discover fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (username) => {
    if (!user) { triggerAuthGate(); return; }
    try {
      const currentStatus = followMap[username];
      const isFollowing = currentStatus === 'following' || (currentStatus === undefined && suggestions.find(s => s.username === username)?.following);
      const isRequested = currentStatus === 'requested' || (currentStatus === undefined && suggestions.find(s => s.username === username)?.followRequestSent);

      if (isFollowing) {
        await API.delete(`/follow/${username}`);
        updateFollow(username, null);
      } else if (isRequested) {
        await API.delete(`/follow/${username}`);
        updateFollow(username, null);
      } else {
        const res = await API.post(`/follow/${username}`);
        const status = res.data?.status;
        updateFollow(username, status || 'following');
      }
    } catch {}
  };

  const handlePostClick = (post) => {
    if (!user) { triggerAuthGate(); return; }
    setInitialPostId(post.id);
    setViewMode('feed');
  };

  if (viewMode === 'feed') {
    return (
      <div className="flex flex-col gap-4">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 0', marginBottom: 4, position: 'sticky', top: 0,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          zIndex: 100, borderBottom: '0.5px solid #f3f4f6'
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#1a1a1a', fontWeight: 600, fontSize: 14,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Explore
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
            />
          ))}
          {hasMore && (
            <button
              style={{
                marginTop: 16, fontSize: 13, color: '#7F77DD',
                textAlign: 'center', width: '100%', padding: '12px 0',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
            >
              Load more
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Suggested users strip — only for logged-in */}
      {user && suggestions.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 10 }}>
            Suggested for you
          </h2>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {suggestions.map(u => {
              const mapStatus = followMap[u.username];
              const isFollowing = mapStatus === 'following' || (mapStatus === undefined && u.following);
              const isRequested = mapStatus === 'requested' || (mapStatus === undefined && u.followRequestSent);
              return (
                <div
                  key={u.username}
                  className="card"
                  style={{
                    padding: '14px 12px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 8, minWidth: 120, flexShrink: 0,
                  }}
                >
                  <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${u.username}`)}>
                    <Avatar username={u.username} avatarUrl={u.avatarUrl} size={44} />
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: 100 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>@{u.username}</div>
                  </div>
                  <button
                    onClick={() => handleFollow(u.username)}
                    style={{
                      padding: '4px 12px', borderRadius: 6, border: 'none',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: isFollowing ? '#e4e6eb' : isRequested ? '#f3f4f6' : '#EEEDFE',
                      color: isFollowing ? '#444' : isRequested ? '#9ca3af' : '#534AB7',
                    }}
                  >
                    {isFollowing ? 'Following' : isRequested ? 'Requested' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Posts grid */}
      <section>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>
          {user ? 'Explore' : 'Explore — read what others are writing'}
        </h2>

        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>Finding what's real...</div>
        ) : posts.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
            No posts yet. Be the first!
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3,
            }}>
              {posts.map(post => (
                <GridCell key={post.id} post={post} onClick={() => handlePostClick(post)} />
              ))}
            </div>

            {hasMore && (
              <button
                style={{
                  marginTop: 16, fontSize: 13, color: '#7F77DD',
                  textAlign: 'center', width: '100%', padding: '12px 0',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
                onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
              >
                Load more
              </button>
            )}
          </>
        )}
      </section>

      {/* Post modal removed in favor of Feed View */}
    </div>
  );
};

export default Discover;
