import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostCard } from '../components/Post';
import { Avatar } from '../components/Navigation';
import ImageCropModal from '../components/ImageCropModal';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

/* ── Engaging Follow Button ── */
const FollowBtn = ({ profile, onClick, loading }) => {
  const [hover, setHover] = useState(false);
  const isFollowing = profile.following;
  const isRequested = profile.followRequestSent;

  let label, bg, color, border;
  if (loading) {
    label = '...'; bg = '#f0f2f5'; color = '#9ca3af'; border = '1px solid #e5e5e5';
  } else if (isFollowing) {
    label = hover ? 'Unfollow' : '✓ Following';
    bg = hover ? '#fef2f2' : '#f0f2f5';
    color = hover ? '#dc2626' : '#374151';
    border = hover ? '1px solid #fecaca' : '1px solid #e5e5e5';
  } else if (isRequested) {
    label = hover ? 'Cancel request' : '⏳ Requested';
    bg = hover ? '#fef2f2' : '#fef9ec';
    color = hover ? '#dc2626' : '#92400e';
    border = hover ? '1px solid #fecaca' : '1px solid #fde68a';
  } else {
    label = '+ Follow';
    bg = '#7F77DD';
    color = '#fff';
    border = 'none';
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
      style={{
        padding: '8px 20px', borderRadius: 20,
        fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
        transition: 'all 0.15s', background: bg, color, border,
        boxShadow: !isFollowing && !isRequested && !loading ? '0 2px 8px rgba(127,119,221,0.35)' : 'none',
      }}
    >
      {label}
    </button>
  );
};

/* ── Edit Profile Modal ── */
const EditProfileModal = ({ profile, onSave, onClose }) => {
  const [name, setName] = useState(profile.name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [isPrivate, setIsPrivate] = useState(profile.privateProfile || false);

  const [avatarSrc, setAvatarSrc] = useState(null);
  const [avatarBlob, setAvatarBlob] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || null);
  const [showAvatarCrop, setShowAvatarCrop] = useState(false);

  const [bannerSrc, setBannerSrc] = useState(null);
  const [bannerBlob, setBannerBlob] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(profile.bannerUrl || null);
  const [showBannerCrop, setShowBannerCrop] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const avatarInputRef = useRef();
  const bannerInputRef = useRef();

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarSrc(URL.createObjectURL(file));
    setShowAvatarCrop(true);
    e.target.value = '';
  };

  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerSrc(URL.createObjectURL(file));
    setShowBannerCrop(true);
    e.target.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      if (name.trim()) formData.append('name', name.trim());
      formData.append('bio', bio);
      formData.append('isPrivate', isPrivate);
      if (avatarBlob) formData.append('avatar', avatarBlob, 'avatar.jpg');
      if (bannerBlob) formData.append('banner', bannerBlob, 'banner.jpg');

      const res = await API.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          width: '100%', maxWidth: 480,
          boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Edit Profile</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af' }}>✕</button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ position: 'relative', height: 110, background: '#EEEDFE', cursor: 'pointer' }}
              onClick={() => bannerInputRef.current.click()}
            >
              {bannerPreview
                ? <img src={bannerPreview} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7F77DD, #AFA9EC)' }} />
              }
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Change banner</span>
              </div>
              <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerFile} />
            </div>

            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ marginTop: -32, marginBottom: 16, display: 'inline-block', position: 'relative' }}>
                <div
                  style={{ border: '3px solid #fff', borderRadius: '50%', cursor: 'pointer', display: 'inline-block', background: '#fff' }}
                  onClick={() => avatarInputRef.current.click()}
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                    : <Avatar username={profile.username} size={64} />
                  }
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ color: '#fff', fontSize: 18 }}>✎</span>
                  </div>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Name</label>
                <input
                  className="input-base"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Bio</label>
                <textarea
                  className="input-base"
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'none', height: 72 }}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell people a little about yourself"
                />
              </div>

              {/* Private account toggle */}
              <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e5e5' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Private account</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Only approved followers can see your posts</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivate(prev => !prev)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: isPrivate ? '#7F77DD' : '#d1d5db',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 2, left: isPrivate ? 22 : 2,
                    width: 20, height: 20, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{error}</p>}
            </div>
          </div>

          <div style={{
            padding: '12px 20px', borderTop: '1px solid #f3f4f6',
            display: 'flex', gap: 8, justifyContent: 'flex-end', flexShrink: 0,
          }}>
            <button onClick={onClose} style={{
              padding: '8px 18px', borderRadius: 8, background: '#f3f4f6',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: '8px 18px', borderRadius: 8, background: '#7F77DD',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {showAvatarCrop && avatarSrc && (
        <ImageCropModal
          imageSrc={avatarSrc}
          aspect={1}
          cropShape="round"
          title="Adjust profile photo"
          onComplete={(blob) => {
            setAvatarBlob(blob);
            setAvatarPreview(URL.createObjectURL(blob));
            setShowAvatarCrop(false);
          }}
          onCancel={() => { setShowAvatarCrop(false); setAvatarSrc(null); }}
        />
      )}
      {showBannerCrop && bannerSrc && (
        <ImageCropModal
          imageSrc={bannerSrc}
          aspect={16 / 5}
          cropShape="rect"
          title="Adjust banner photo"
          onComplete={(blob) => {
            setBannerBlob(blob);
            setBannerPreview(URL.createObjectURL(blob));
            setShowBannerCrop(false);
          }}
          onCancel={() => { setShowBannerCrop(false); setBannerSrc(null); }}
        />
      )}
    </>
  );
};

/* ── Followers / Following Modal ── */
const UsersListModal = ({ title, users, onClose }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }} onClick={onClose}>
      <div
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: 380,
          maxHeight: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {users.length === 0 ? (
            <div style={{ padding: '24px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No users yet</div>
          ) : (
            users.map(u => (
              <div
                key={u.username}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
                onClick={() => { navigate(`/profile/${u.username}`); onClose(); }}
              >
                <Avatar username={u.username} avatarUrl={u.avatarUrl} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>@{u.username}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Profile Page ── */
const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, setUser, updateFollow, followMap } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [usersModal, setUsersModal] = useState(null); // { title, users }
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get(`/users/${username}`),
      API.get(`/posts/user/${username}`),
    ])
      .then(([profileRes, postsRes]) => {
        setProfile(profileRes.data);
        setPosts(postsRes.data);
      })
      .catch(err => console.error('Profile fetch failed', err))
      .finally(() => setLoading(false));
  }, [username]);

  const handleFollowToggle = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      if (effectiveFollowing) {
        await API.delete(`/follow/${username}`);
        updateFollow(username, null);
        setProfile(prev => ({ ...prev, following: false, followRequestSent: false, followersCount: prev.followersCount - 1 }));
      } else if (effectiveRequested) {
        await API.delete(`/follow/${username}`);
        updateFollow(username, null);
        setProfile(prev => ({ ...prev, followRequestSent: false }));
      } else {
        const res = await API.post(`/follow/${username}`);
        const status = res.data?.status === 'requested' ? 'requested' : 'following';
        updateFollow(username, status);
        if (status === 'requested') {
          setProfile(prev => ({ ...prev, followRequestSent: true }));
        } else {
          setProfile(prev => ({ ...prev, following: true, followersCount: prev.followersCount + 1 }));
        }
      }
    } catch (err) {
      console.error('Follow toggle failed', err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const openFollowers = async () => {
    setUsersLoading(true);
    try {
      const res = await API.get(`/follow/${username}/followers`);
      setUsersModal({ title: 'Followers', users: res.data });
    } catch {}
    setUsersLoading(false);
  };

  const openFollowing = async () => {
    setUsersLoading(true);
    try {
      const res = await API.get(`/follow/${username}/following`);
      setUsersModal({ title: 'Following', users: res.data });
    } catch {}
    setUsersLoading(false);
  };

  const handleProfileSaved = (updated) => {
    setProfile(updated);
    if (currentUser?.username === username) {
      setUser(prev => ({ ...prev, name: updated.name, avatarUrl: updated.avatarUrl, bannerUrl: updated.bannerUrl }));
    }
    setShowEdit(false);
  };

  if (loading) return <div className="p-8 text-center text-[#9ca3af]">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-[#9ca3af]">User not found.</div>;

  const isOwnProfile = profile.username === currentUser?.username;

  // followMap (from context) wins over stale profile state — keeps Profile and RightPanel in sync
  const mapStatus = followMap[username]; // 'following' | 'requested' | null | undefined
  const effectiveFollowing  = mapStatus !== undefined ? mapStatus === 'following'  : profile.following;
  const effectiveRequested  = mapStatus !== undefined ? mapStatus === 'requested'  : profile.followRequestSent;
  const canViewPosts = isOwnProfile || effectiveFollowing || !profile.privateProfile;

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div style={{ width: '100%', height: 128, borderRadius: 12, overflow: 'hidden', marginBottom: -40, flexShrink: 0 }}>
        {profile.bannerUrl
          ? <img src={profile.bannerUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7F77DD, #AFA9EC)' }} />
        }
      </div>

      {/* Profile info */}
      <div className="px-4 flex flex-col gap-3 relative z-10">
        <div className="flex items-end justify-between">
          <div style={{ border: '4px solid #fff', borderRadius: '50%', background: '#fff', display: 'inline-block' }}>
            <Avatar username={profile.username} avatarUrl={profile.avatarUrl} size={80} />
          </div>
          <div className="flex gap-2 mb-1">
            {isOwnProfile ? (
              <button className="btn-outline" onClick={() => setShowEdit(true)}>
                Edit Profile
              </button>
            ) : (
              <FollowBtn
                profile={{ ...profile, following: effectiveFollowing, followRequestSent: effectiveRequested }}
                onClick={handleFollowToggle}
                loading={followLoading}
              />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium text-[#1a1a1a]">{profile.name}</h1>
            {profile.privateProfile && (
              <span style={{ fontSize: 13, color: '#9ca3af' }} title="Private account">🔒</span>
            )}
          </div>
          <p className="text-[#9ca3af] text-sm">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-sm text-[#6b7280] leading-relaxed">{profile.bio}</p>
        )}

        <div className="flex gap-4 text-sm">
          <button
            className="text-[#1a1a1a] font-medium bg-transparent border-none cursor-pointer p-0"
            onClick={canViewPosts ? openFollowers : undefined}
            disabled={!canViewPosts || usersLoading}
            style={{ cursor: canViewPosts ? 'pointer' : 'default' }}
          >
            {profile.followersCount ?? 0}{' '}
            <span className="text-[#9ca3af] font-normal">Followers</span>
          </button>
          <button
            className="text-[#1a1a1a] font-medium bg-transparent border-none cursor-pointer p-0"
            onClick={canViewPosts ? openFollowing : undefined}
            disabled={!canViewPosts || usersLoading}
            style={{ cursor: canViewPosts ? 'pointer' : 'default' }}
          >
            {profile.followingCount ?? 0}{' '}
            <span className="text-[#9ca3af] font-normal">Following</span>
          </button>
          <span className="text-[#1a1a1a] font-medium">
            {profile.postsCount ?? posts.length}{' '}
            <span className="text-[#9ca3af] font-normal">Posts</span>
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8 border-t border-[#e5e5e5] pt-6 flex flex-col gap-4">
        {!canViewPosts ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>This account is private</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
              {effectiveRequested
                ? 'Your follow request is pending approval.'
                : 'Follow this account to see their posts.'}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-medium text-[#1a1a1a] px-1">Posts</h2>
            {posts.length === 0 ? (
              <div className="p-8 text-center text-[#9ca3af]">No posts shared yet.</div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={async (postId) => {
                    const target = posts.find(p => p.id === postId);
                    if (!target) return;
                    try {
                      if (target.liked) {
                        await API.delete(`/posts/${postId}/like`);
                      } else {
                        await API.post(`/posts/${postId}/like`);
                      }
                      setPosts(prev => prev.map(p => p.id === postId
                        ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 }
                        : p));
                    } catch {}
                  }}
                  onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
                />
              ))
            )}
          </>
        )}
      </div>

      {showEdit && (
        <EditProfileModal
          profile={profile}
          onSave={handleProfileSaved}
          onClose={() => setShowEdit(false)}
        />
      )}

      {usersModal && (
        <UsersListModal
          title={usersModal.title}
          users={usersModal.users}
          onClose={() => setUsersModal(null)}
        />
      )}
    </div>
  );
};

export default Profile;
