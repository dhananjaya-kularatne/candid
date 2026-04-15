import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../Avatar'
import { getComments, addComment, deletePost, deleteComment } from '../../api/posts'
import useConfirm from '../useConfirm'
import { timeAgo } from '../../utils/dateUtils'


export default function PostModal({ post, onClose, onLike, onDelete }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [confirm, confirmModal] = useConfirm()

  useEffect(() => {
    getComments(post.id)
      .then(res => setComments(res.data))
      .catch(() => {})

    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [post.id])

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const res = await addComment(post.id, newComment.trim())
      setComments(prev => [...prev, res.data])
      setNewComment('')
    } catch {}
    setSubmitting(false)
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch {}
  }

  const handleDelete = async () => {
    const ok = await confirm({
      message: 'Delete this post?',
      subMessage: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmDanger: true,
    })
    if (!ok) return
    try {
      await deletePost(post.id)
      onDelete?.()
      onClose()
    } catch {}
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      {confirmModal}
      <div
        className="card"
        style={{ width: '90%', maxWidth: 560, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar user={post.user} size={32} />
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', cursor: 'pointer' }}
                onClick={() => { navigate(`/profile/${post.user.username}`); onClose() }}
              >
                {post.user.name}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>@{post.user.username} · {timeAgo(post.createdAt, { short: true })}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {user?.id === post.user.id && (
              <button
                onClick={handleDelete}
                style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9ca3af' }}
            >×</button>
          </div>
        </div>

        {/* Post content */}
        <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #e5e5e5' }}>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{post.content}</p>
          {post.mood && <span className="mood-pill" style={{ marginTop: 8, display: 'inline-block' }}>{post.mood}</span>}
          {(post.imageUrls || []).map((url, i) => (
            <img key={i} src={url} alt="post" style={{ width: '100%', height: 'auto', borderRadius: 8, marginTop: 10 }} />
          ))}
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <button className={`action-btn ${post.liked ? 'liked' : ''}`} onClick={onLike}>
              ♥ {post.likesCount}
            </button>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>◎ {comments.length} comments</span>
          </div>
        </div>

        {/* Comments */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px' }}>
          {comments.length === 0 && (
            <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 16 }}>No comments yet.</p>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div
                style={{ cursor: user ? 'pointer' : 'default', flexShrink: 0 }}
                onClick={() => user && (navigate(`/profile/${c.user.username}`), onClose())}
              >
                <Avatar user={c.user} size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                    <span
                      style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', cursor: user ? 'pointer' : 'default' }}
                      onClick={() => user && (navigate(`/profile/${c.user.username}`), onClose())}
                    >{c.user.name}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(c.createdAt, { short: true })}</span>
                  </div>
                  {user?.username === c.user.username && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#9ca3af', padding: '0 2px', flexShrink: 0 }}
                      title="Delete comment"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{c.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <form
          onSubmit={handleComment}
          style={{ padding: '10px 16px', borderTop: '0.5px solid #e5e5e5', display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <Avatar user={user} size={28} />
          <input
            className="input-base"
            style={{ flex: 1 }}
            placeholder="Write a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button className="btn-primary" type="submit" disabled={submitting} style={{ padding: '7px 14px', fontSize: 13 }}>
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
