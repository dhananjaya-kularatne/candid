import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Navigation';
import { PostCard } from '../components/Post';
import API from '../api/axios';
import { timeAgo } from '../utils/dateUtils';

const TYPE_TEXT = {
  LIKE:            (n) => <><span className="font-medium">{n.actor?.name}</span> liked your post</>,
  COMMENT:         (n) => <><span className="font-medium">{n.actor?.name}</span> commented on your post</>,
  FOLLOW:          (n) => <><span className="font-medium">{n.actor?.name}</span> started following you</>,
  FOLLOW_REQUEST:  (n) => <><span className="font-medium">{n.actor?.name}</span> wants to follow you</>,
  FOLLOW_ACCEPTED: (n) => <><span className="font-medium">{n.actor?.name}</span> accepted your follow request</>,
  ANNOUNCEMENT:    (n) => <><span className="font-medium">Candid</span> — {n.message}</>,
};

const TYPE_ICON = {
  LIKE:            '♥',
  COMMENT:         '◎',
  FOLLOW:          '✦',
  FOLLOW_REQUEST:  '✦',
  FOLLOW_ACCEPTED: '✦',
  ANNOUNCEMENT:    '📢',
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestActions, setRequestActions] = useState({}); // notifId -> 'accepted' | 'declined'
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/notifications')
      .then(res => {
        setNotifications(res.data.content ?? res.data);
        API.put('/notifications/read-all').catch(() => {});
      })
      .catch(err => console.error('Notifications failed', err))
      .finally(() => setLoading(false));
  }, []);

  const markAllFromActor = (actorUsername, action) => {
    setRequestActions(prev => {
      const updates = {};
      notifications.forEach(n => {
        if (n.type === 'FOLLOW_REQUEST' && n.actor?.username === actorUsername) {
          updates[n.id] = action;
        }
      });
      return { ...prev, ...updates };
    });
  };

  const handleAccept = async (notifId, actorUsername) => {
    try {
      await API.post(`/follow/requests/${actorUsername}/accept`);
      markAllFromActor(actorUsername, 'accepted');
    } catch {}
  };

  const handleDecline = async (notifId, actorUsername) => {
    try {
      await API.post(`/follow/requests/${actorUsername}/decline`);
      markAllFromActor(actorUsername, 'declined');
    } catch {}
  };

  const getClickHandler = (n) => {
    if (n.type === 'COMMENT' || n.type === 'LIKE') {
      if (n.postId) return () => navigate(`/post/${n.postId}`);
    }
    if (n.type === 'FOLLOW' || n.type === 'FOLLOW_ACCEPTED') {
      if (n.actor?.username) return () => navigate(`/profile/${n.actor.username}`);
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <h2 className="text-sm font-medium text-[#1a1a1a]">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <span className="text-[11px] text-[#7F77DD]">Marked all as read</span>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#9ca3af]">Checking updates...</div>
      ) : notifications.length === 0 ? (
        <div className="card p-8 text-center text-[#9ca3af]">No notifications yet.</div>
      ) : (
        notifications.map(n => {
          const clickHandler = getClickHandler(n);
          const actionDone = requestActions[n.id];

          return (
            <div
              key={n.id}
              className={`card p-4 flex gap-3 ${!n.read ? 'border-l-2 border-l-[#7F77DD]' : ''} ${clickHandler ? 'cursor-pointer hover:bg-[#fafafa]' : ''}`}
              onClick={clickHandler ?? undefined}
              style={{ transition: 'background 0.1s' }}
            >
              {/* Icon badge or avatar */}
              <div className="relative flex-shrink-0">
                {n.type === 'ANNOUNCEMENT' ? (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    📢
                  </div>
                ) : (
                  <Avatar username={n.actor?.username} avatarUrl={n.actor?.avatarUrl} size={36} />
                )}
                <span style={{
                  position: 'absolute', bottom: -2, right: -2,
                  fontSize: 10, width: 16, height: 16, borderRadius: '50%',
                  background: '#EEEDFE', color: '#534AB7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {TYPE_ICON[n.type] || '•'}
                </span>
              </div>

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="text-sm text-[#1a1a1a] leading-relaxed">
                  {(TYPE_TEXT[n.type] ?? (() => n.message))(n)}
                </p>
                <span className="text-[11px] text-[#9ca3af]">{timeAgo(n.createdAt)}</span>

                {/* Follow request actions */}
                {n.type === 'FOLLOW_REQUEST' && n.actor && (
                  <div className="flex gap-2 mt-1" onClick={e => e.stopPropagation()}>
                    {!actionDone ? (
                      <>
                        <button
                          onClick={() => handleAccept(n.id, n.actor.username)}
                          style={{
                            padding: '5px 14px', borderRadius: 6, border: 'none',
                            background: '#7F77DD', color: '#fff',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(n.id, n.actor.username)}
                          style={{
                            padding: '5px 14px', borderRadius: 6,
                            border: '1px solid #e5e5e5', background: '#f3f4f6',
                            color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: actionDone === 'accepted' ? '#7F77DD' : '#9ca3af' }}>
                        {actionDone === 'accepted' ? 'Request accepted' : 'Request declined'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

    </div>
  );
};

export const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookmarks')
      .then(res => setPosts(res.data.content ?? res.data))
      .catch(err => console.error('Bookmarks failed', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    try {
      if (post.liked) {
        await API.delete(`/posts/${postId}/like`);
      } else {
        await API.post(`/posts/${postId}/like`);
      }
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 }
        : p));
    } catch {}
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-[#1a1a1a] px-1 mb-2">Saved Posts</h2>
      {loading ? (
        <div className="p-8 text-center text-[#9ca3af]">Accessing your bookmarks...</div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center text-[#9ca3af]">You haven't saved any posts yet.</div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
          />
        ))
      )}
    </div>
  );
};
