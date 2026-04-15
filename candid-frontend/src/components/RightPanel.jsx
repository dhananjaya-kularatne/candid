import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSuggestedUsers, followUser, unfollowUser } from '../api/users';
import API from '../api/axios';
import { Avatar } from './Navigation';

const RightPanel = () => {
  const { user, followMap, updateFollow } = useAuth();
  const navigate = useNavigate();
  const [suggested, setSuggested] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (user) {
      getSuggestedUsers()
        .then(res => setSuggested((res.data ?? []).slice(0, 5)))
        .catch(() => {});
    } else {
      setSuggested([]);
    }
    API.get('/hashtags/trending')
      .then(res => setTrending((res.data ?? []).slice(0, 8)))
      .catch(() => {});
  }, [user]);

  const handleFollow = async (username, currentlyFollowing) => {
    updateFollow(username, currentlyFollowing ? null : 'following');
    try {
      if (currentlyFollowing) await unfollowUser(username);
      else await followUser(username);
    } catch {
      updateFollow(username, currentlyFollowing ? 'following' : null);
    }
  };

  return (
    <aside className="right-panel">
      {user && suggested.length > 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#050505', marginBottom: 12 }}>
            Suggested for you
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {suggested.map(u => {
              const isFollowing = followMap[u.username] === 'following';
              return (
                <div key={u.username} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px' }}>
                  <div
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}
                    onClick={() => navigate(`/profile/${u.username}`)}
                  >
                    <Avatar username={u.username} avatarUrl={u.avatarUrl} size={34} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#65676b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        @{u.username}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(u.username, isFollowing)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', border: '1.5px solid #7F77DD',
                      background: isFollowing ? '#EEEDFE' : '#fff',
                      color: '#7F77DD', flexShrink: 0, transition: 'background 0.12s',
                    }}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#050505', marginBottom: 12 }}>
            Trending
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {trending.map(tag => (
              <button
                key={tag.name}
                onClick={() => navigate(`/tag/${encodeURIComponent(tag.name)}`)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '7px 8px', borderRadius: 8,
                  transition: 'background 0.12s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f2f5'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#7F77DD' }}>#{tag.name}</div>
                {tag.postCount != null && (
                  <div style={{ fontSize: 11, color: '#8a8d91', marginTop: 1 }}>{tag.postCount} posts</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #e4e6eb' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Cookies', '/cookies']].map(([label, path]) => (
            <button key={label} onClick={() => navigate(path)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#8a8d91', padding: 0, fontFamily: 'inherit' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#b0b3b8', marginTop: 6 }}>© {new Date().getFullYear()} Candid</div>
      </div>
    </aside>
  );
};

export default RightPanel;
