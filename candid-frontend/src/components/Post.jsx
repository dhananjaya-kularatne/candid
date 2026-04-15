import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from './Navigation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageCropModal from './ImageCropModal';
import useConfirm from './useConfirm';
import API from '../api/axios';
import { timeAgo } from '../utils/dateUtils';

/* ── SVG Icons ── */
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#E5534B' : 'none'}
    stroke={filled ? '#E5534B' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? '#7F77DD' : 'none'}
    stroke={filled ? '#7F77DD' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ── Facebook-style image grid (for PostCard) ── */
const ImageGrid = ({ urls }) => {
  const count = urls.length;
  if (count === 0) return null;

  const imgFit = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  if (count === 1) {
    return (
      <div style={{ margin: '0 -18px 12px', overflow: 'hidden' }}>
        <img src={urls[0]} alt="post" style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'cover' }} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div style={{ margin: '0 -18px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 280, overflow: 'hidden' }}>
        {urls.map((url, i) => <img key={i} src={url} alt="post" style={imgFit} />)}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div style={{ margin: '0 -18px 12px', display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, height: 320, overflow: 'hidden' }}>
        <img src={urls[0]} alt="post" style={{ ...imgFit, gridRow: '1 / 3' }} />
        <img src={urls[1]} alt="post" style={imgFit} />
        <img src={urls[2]} alt="post" style={imgFit} />
      </div>
    );
  }

  if (count === 4) {
    return (
      <div style={{ margin: '0 -18px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, height: 360, overflow: 'hidden' }}>
        {urls.map((url, i) => <img key={i} src={url} alt="post" style={imgFit} />)}
      </div>
    );
  }

  // 5+ images: first full width, then 2x2 with +N overlay on last visible
  const visible = urls.slice(0, 5);
  const extra = count - 5;
  return (
    <div style={{ margin: '0 -18px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
      <img src={visible[0]} alt="post" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {visible.slice(1).map((url, i) => {
          const isLast = i === 3 && extra > 0;
          return (
            <div key={i} style={{ position: 'relative', height: 150 }}>
              <img src={url} alt="post" style={{ ...imgFit, filter: isLast ? 'brightness(0.45)' : 'none' }} />
              {isLast && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px',
                }}>
                  +{extra}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── ComposeBox ── */
export const ComposeBox = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  // Each entry: { id, blob, preview, originalPreview }
  const [images, setImages] = useState([]);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropTargetIndex, setCropTargetIndex] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const fileInputRef = useRef();
  const { user } = useAuth();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newImages = files.map((file, i) => {
      const preview = URL.createObjectURL(file);
      return { id: Date.now() + i, blob: file, preview, originalPreview: preview };
    });
    setImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const adjustImage = (index) => {
    setCropSrc(images[index].originalPreview);
    setCropTargetIndex(index);
    setShowCrop(true);
  };

  const handleCropComplete = (blob) => {
    const newPreview = URL.createObjectURL(blob);
    setImages(prev => prev.map((img, i) =>
      i === cropTargetIndex ? { ...img, blob, preview: newPreview } : img
    ));
    setShowCrop(false);
    setCropSrc(null);
    setCropTargetIndex(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    if (mood) formData.append('mood', mood);
    images.forEach(img => formData.append('images', img.blob, 'photo.jpg'));
    try {
      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setMood('');
      setImages([]);
      setFocused(false);
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error('Failed to post', err);
    } finally {
      setLoading(false);
    }
  };

  // Grid layout for preview images in compose box
  const previewGridStyle = () => {
    const n = images.length;
    if (n === 1) return { gridTemplateColumns: '1fr' };
    if (n === 2) return { gridTemplateColumns: '1fr 1fr' };
    return { gridTemplateColumns: '1fr 1fr 1fr' };
  };

  const previewHeight = images.length === 1 ? 260 : 160;

  return (
    <>
      <div className="card p-4">
        <div className="flex gap-3">
          <Avatar username={user?.username} avatarUrl={user?.avatarUrl} size={38} />
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] leading-relaxed"
              style={{ minHeight: focused ? 72 : 40, transition: 'min-height 0.2s' }}
              placeholder="Write your thoughts, daily blog, or anything on your mind..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setFocused(true)}
            />

            {/* Image previews grid */}
            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gap: 4,
                borderRadius: 10,
                overflow: 'hidden',
                ...previewGridStyle(),
              }}>
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    style={{
                      position: 'relative',
                      height: previewHeight,
                      borderRadius: images.length === 1 ? 10 : 4,
                      overflow: 'hidden',
                      background: '#f0f2f5',
                    }}
                  >
                    <img
                      src={img.preview}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => removeImage(img.id)}
                      style={{
                        position: 'absolute', top: 6, right: 6,
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        border: 'none', borderRadius: '50%',
                        width: 26, height: 26, fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700,
                      }}
                    >✕</button>
                    {/* Adjust button */}
                    <button
                      onClick={() => adjustImage(i)}
                      style={{
                        position: 'absolute', bottom: 6, right: 6,
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        border: 'none', borderRadius: 6,
                        padding: '3px 10px', fontSize: 12, cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >Adjust</button>
                  </div>
                ))}
                {/* Add more images button (appears as last grid cell) */}
                {images.length > 0 && images.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      height: previewHeight,
                      borderRadius: images.length === 0 ? 10 : 4,
                      border: '2px dashed #dddfe2',
                      background: '#f7f8fa',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 6, color: '#8a8d91',
                    }}
                  >
                    <span style={{ fontSize: 24, lineHeight: 1 }}>+</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>Add photo</span>
                  </button>
                )}
              </div>
            )}

            {(focused || content || images.length > 0) && (
              <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="text-[#9ca3af] hover:text-[#7F77DD] transition-colors"
                    title="Add photos"
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#65676b' }}
                  >
                    <ImageIcon />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Photo</span>
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
                  <select
                    className="text-[12px] bg-[#f3f4f6] rounded-full px-3 py-1 outline-none border-none text-[#6b7280] cursor-pointer"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option value="">Mood</option>
                    <option value="happy">Happy</option>
                    <option value="reflective">Reflective</option>
                    <option value="tired">Tired</option>
                    <option value="grateful">Grateful</option>
                    <option value="excited">Excited</option>
                    <option value="chill">Chill</option>
                  </select>
                </div>
                <button
                  className="btn-primary !py-1.5 !px-5 !text-[13px]"
                  onClick={handleSubmit}
                  disabled={loading || (!content.trim() && images.length === 0)}
                  style={{ opacity: (!content.trim() && images.length === 0) ? 0.5 : 1 }}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCrop && cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={4 / 3}
          cropShape="rect"
          title="Adjust photo"
          onComplete={handleCropComplete}
          onCancel={() => { setShowCrop(false); setCropSrc(null); setCropTargetIndex(null); }}
        />
      )}
    </>
  );
};

/* ── Reusable full-width action button ── */
const ActionBtn = ({ onClick, active, activeColor, icon, label }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '8px 4px', borderRadius: 6, border: 'none', cursor: 'pointer',
        background: hovered ? '#f0f2f5' : 'none',
        color: active ? activeColor : '#65676b',
        fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
        transition: 'background 0.12s, color 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  );
};


/* ── CommentItem ── */
const CommentItem = ({ comment: c, postId, currentUser, navigate, onReplyAdded, onDeleteComment, topLevelId, depth = 0 }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const replyInputRef = useRef();
  const { triggerAuthGate } = useAuth();

  const handleDelete = async () => {
    try {
      await API.delete(`/comments/${c.id}`);
      onDeleteComment && onDeleteComment(c.id);
    } catch {}
  };

  const goToProfile = (username) => {
    if (!currentUser) { triggerAuthGate(); return; }
    navigate(`/profile/${username}`);
  };

  const threadRootId = topLevelId ?? c.id;

  const openReply = () => {
    setShowReplyBox(true);
    setReplyText(`@${c.user?.username} `);
    setTimeout(() => replyInputRef.current?.focus(), 50);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await API.post(`/posts/${postId}/comments`, {
        content: replyText,
        parentId: String(threadRootId),
      });
      onReplyAdded(threadRootId, res.data);
      setReplyText('');
      setShowReplyBox(false);
      setShowReplies(true);
    } catch {}
    setSubmitting(false);
  };

  const avatarSize = depth > 0 ? 28 : 32;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <div
        style={{ flexShrink: 0, cursor: 'pointer', marginTop: 2 }}
        onClick={() => goToProfile(c.user?.username)}
      >
        <Avatar username={c.user?.username} avatarUrl={c.user?.avatarUrl} size={avatarSize} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Bubble */}
        <div style={{
          display: 'inline-block', maxWidth: '100%',
          background: '#f0f2f5', borderRadius: 18,
          padding: '8px 14px', lineHeight: 1.4,
        }}>
          <span
            style={{ fontSize: 13, fontWeight: 600, color: '#050505', cursor: 'pointer' }}
            onClick={() => goToProfile(c.user?.username)}
          >
            {c.user?.name}
          </span>
          <br />
          <span style={{ fontSize: 14, color: '#1c1e21' }}>{c.content}</span>
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, paddingLeft: 4 }}>
          <span style={{ fontSize: 12, color: '#65676b' }}>{timeAgo(c.createdAt, { short: true })}</span>
          <button
            onClick={() => { if (!currentUser) { triggerAuthGate(); return; } openReply(); }}
            style={{
              fontSize: 12, fontWeight: 600, color: '#65676b',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            Reply
          </button>
          {currentUser?.username === c.user?.username && (
            <button
              onClick={handleDelete}
              style={{
                fontSize: 12, fontWeight: 600, color: '#ef4444',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              Delete
            </button>
          )}
        </div>

        {/* Replies toggle */}
        {depth === 0 && (c.replies || []).length > 0 && (
          <div style={{ marginTop: 6, paddingLeft: 4 }}>
            <button
              onClick={() => setShowReplies(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 12, fontWeight: 600, color: '#7F77DD',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showReplies ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {showReplies
                ? 'Hide replies'
                : `View ${c.replies.length} ${c.replies.length === 1 ? 'reply' : 'replies'}`}
            </button>

            {showReplies && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {(c.replies || []).map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    currentUser={currentUser}
                    navigate={navigate}
                    onReplyAdded={onReplyAdded}
                    onDeleteComment={onDeleteComment}
                    topLevelId={threadRootId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reply input */}
        {showReplyBox && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <Avatar username={currentUser?.username} avatarUrl={currentUser?.avatarUrl} size={28} />
            <form
              onSubmit={handleReply}
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: '#f0f2f5', borderRadius: 20, padding: '6px 12px' }}
            >
              <input
                ref={replyInputRef}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 13, color: '#1c1e21', fontFamily: 'Inter, sans-serif',
                }}
                placeholder={`Reply to ${c.user?.name}...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setShowReplyBox(false); }}
              />
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: replyText.trim() ? '#7F77DD' : '#bcc0c4',
                  display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                }}
              >
                <SendIcon />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── PostCard ── */
const renderContent = (text, navigate) => {
  if (!text) return null;
  return text.split(/(#\w+)/g).map((part, i) =>
    part.startsWith('#') ? (
      <span
        key={i}
        style={{ color: '#7F77DD', cursor: 'pointer', fontWeight: 500 }}
        onClick={(e) => { e.stopPropagation(); navigate(`/tag/${part.slice(1)}`); }}
      >
        {part}
      </span>
    ) : part
  );
};

export const PostCard = ({ post: initialPost, onLike, onDelete }) => {
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const { user: currentUser, triggerAuthGate } = useAuth();
  const [confirm, confirmModal] = useConfirm();
  const navigate = useNavigate();

  // Returns true if user is logged in, otherwise shows auth gate and returns false
  const gate = (fn) => (...args) => {
    if (!currentUser) { triggerAuthGate(); return; }
    return fn(...args);
  };

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const handleLike = async () => {
    try {
      if (post.liked) {
        await API.delete(`/posts/${post.id}/like`);
        setPost(p => ({ ...p, liked: false, likesCount: p.likesCount - 1 }));
      } else {
        await API.post(`/posts/${post.id}/like`);
        setPost(p => ({ ...p, liked: true, likesCount: p.likesCount + 1 }));
      }
      onLike && onLike(post.id);
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleBookmark = async () => {
    try {
      if (post.bookmarked) {
        await API.delete(`/bookmarks/${post.id}`);
        setPost(p => ({ ...p, bookmarked: false }));
      } else {
        await API.post(`/bookmarks/${post.id}`);
        setPost(p => ({ ...p, bookmarked: true }));
      }
    } catch (err) {
      console.error('Bookmark failed', err);
    }
  };

  const toggleComments = async () => {
    if (!commentsLoaded) {
      try {
        const res = await API.get(`/posts/${post.id}/comments`);
        setComments(res.data);
        setCommentsLoaded(true);
      } catch {}
    }
    setShowComments(prev => !prev);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/posts/${post.id}/comments`, { content: commentText });
      setComments(prev => [...prev, { ...res.data, replies: [] }]);
      setPost(p => ({ ...p, commentsCount: p.commentsCount + 1 }));
      setCommentText('');
    } catch {}
  };

  const handleDelete = async () => {
    setShowMenu(false);
    const ok = await confirm({
      message: 'Delete this post?',
      subMessage: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmDanger: true,
    });
    if (!ok) return;
    try {
      await API.delete(`/posts/${post.id}`);
      onDelete && onDelete(post.id);
    } catch {}
  };


  const isOwn = currentUser?.username === post.user?.username;
  const imageUrls = post.imageUrls || [];

  return (
    <div id={`post-${post.id}`} className="card" style={{ padding: '16px 18px' }}>
      {confirmModal}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="cursor-pointer flex-shrink-0" onClick={gate(() => navigate(`/profile/${post.user?.username}`))}>
          <Avatar username={post.user?.username} avatarUrl={post.user?.avatarUrl} size={38} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{ fontSize: 15, fontWeight: 700, color: '#050505', cursor: 'pointer' }}
              onClick={gate(() => navigate(`/profile/${post.user?.username}`))}
            >
              {post.user?.name}
            </span>
            {post.mood && (
              <span className="mood-pill capitalize" style={{ fontSize: 11 }}>{post.mood}</span>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#65676b' }}>
            @{post.user?.username} · {timeAgo(post.createdAt, { short: true })}
          </span>
        </div>

        {/* Three-dot menu */}
        {isOwn && (
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu(v => !v)}
              className="text-[#9ca3af] hover:text-[#6b7280] transition-colors p-1 rounded-full hover:bg-[#f3f4f6]"
            >
              <DotsIcon />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '110%', zIndex: 50,
                background: '#fff', border: '0.5px solid #e5e5e5',
                borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                minWidth: 130, overflow: 'hidden',
              }}>
                <button
                  onClick={handleDelete}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 14px', fontSize: 13, color: '#ef4444',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p style={{ fontSize: 15, color: '#1c1e21', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 12, marginTop: 0 }}>
          {renderContent(post.content, navigate)}
        </p>
      )}

      {/* Image grid — bleeds to card edges */}
      <ImageGrid urls={imageUrls} />

      {/* Like / comment counts row */}
      {(post.likesCount > 0 || post.commentsCount > 0) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 2px', marginBottom: 2,
          fontSize: 13, color: '#65676b',
        }}>
          {post.likesCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 14 }}>❤️</span> {post.likesCount.toLocaleString()}
            </span>
          )}
          {post.commentsCount > 0 && (
            <span style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={gate(toggleComments)}>
              {post.commentsCount} comment{post.commentsCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Action bar */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #e4e6eb',
        marginTop: 4, paddingTop: 4,
        gap: 4,
      }}>
        <ActionBtn
          onClick={gate(handleLike)}
          active={post.liked}
          activeColor="#E5534B"
          icon={<HeartIcon filled={post.liked} />}
          label={post.liked ? 'Liked' : 'Like'}
        />
        <ActionBtn
          onClick={gate(toggleComments)}
          active={showComments}
          activeColor="#7F77DD"
          icon={<CommentIcon />}
          label="Comment"
        />
        <ActionBtn
          onClick={gate(handleBookmark)}
          active={post.bookmarked}
          activeColor="#7F77DD"
          icon={<BookmarkIcon filled={post.bookmarked} />}
          label={post.bookmarked ? 'Saved' : 'Save'}
        />
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 12, borderTop: '1px solid #f0f2f5', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {comments.length === 0 && (
            <p style={{ fontSize: 13, color: '#65676b', textAlign: 'center', margin: '4px 0 8px' }}>
              No comments yet. Be the first!
            </p>
          )}

          <div className="flex flex-col gap-3" style={{ marginBottom: comments.length ? 8 : 0 }}>
            {comments.map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                postId={post.id}
                currentUser={currentUser}
                navigate={navigate}
                onReplyAdded={(parentId, reply) => {
                  setComments(prev => prev.map(cm =>
                    cm.id === parentId
                      ? { ...cm, replies: [...(cm.replies || []), reply] }
                      : cm
                  ));
                  setPost(p => ({ ...p, commentsCount: p.commentsCount + 1 }));
                }}
                onDeleteComment={(id) => {
                  setComments(prev => {
                    const withoutTop = prev.filter(cm => cm.id !== id);
                    if (withoutTop.length < prev.length) return withoutTop; // was top-level
                    // was a reply — remove from parent's replies and decrement count
                    return prev.map(cm => ({
                      ...cm,
                      replies: (cm.replies || []).filter(r => r.id !== id),
                    }));
                  });
                  setPost(p => ({ ...p, commentsCount: Math.max(0, p.commentsCount - 1) }));
                }}
              />
            ))}
          </div>

          {/* Top-level comment input — guests see a prompt instead */}
          {!currentUser ? (
            <button
              onClick={triggerAuthGate}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 20,
                background: '#f0f2f5', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: 14, color: '#8a8d91',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Log in to share your thoughts...
            </button>
          ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Avatar username={currentUser?.username} avatarUrl={currentUser?.avatarUrl} size={32} />
            <form
              onSubmit={handleAddComment}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 6,
                background: '#f0f2f5', borderRadius: 20, padding: '8px 14px',
              }}
            >
              <input
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 14, color: '#1c1e21', fontFamily: 'Inter, sans-serif',
                }}
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: commentText.trim() ? '#7F77DD' : '#bcc0c4',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s',
                }}
              >
                <SendIcon />
              </button>
            </form>
          </div>
          )}
        </div>
      )}
    </div>
  );
};
