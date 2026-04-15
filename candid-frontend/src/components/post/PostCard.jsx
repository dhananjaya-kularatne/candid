import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../Avatar'
import { likePost, unlikePost } from '../../api/posts'
import { addBookmark, removeBookmark } from '../../api/bookmarks'
import PostModal from './PostModal'
import { timeAgo } from '../../utils/dateUtils'


function renderContent(content, navigate) {
  const parts = content.split(/(#\w+)/g)
  return parts.map((part, i) =>
    part.startsWith('#')
      ? (
        <span
          key={i}
          className="hashtag"
          style={{ cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); navigate(`/tag/${part.slice(1)}`); }}
        >
          {part}
        </span>
      )
      : part
  )
}

export default function PostCard({ post: initialPost, onDelete }) {
  const [post, setPost] = useState(initialPost)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      if (post.liked) {
        await unlikePost(post.id)
        setPost(p => ({ ...p, liked: false, likesCount: p.likesCount - 1 }))
      } else {
        await likePost(post.id)
        setPost(p => ({ ...p, liked: true, likesCount: p.likesCount + 1 }))
      }
    } catch {}
  }

  const handleBookmark = async (e) => {
    e.stopPropagation()
    try {
      if (post.bookmarked) {
        await removeBookmark(post.id)
        setPost(p => ({ ...p, bookmarked: false }))
      } else {
        await addBookmark(post.id)
        setPost(p => ({ ...p, bookmarked: true }))
      }
    } catch {}
  }

  return (
    <>
      <div className="card" style={{ padding: 14 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Avatar
            user={post.user}
            size={32}
            style={{ cursor: 'pointer' }}
          />
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${post.user.username}`)}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{post.user.name}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>@{post.user.username} · {timeAgo(post.createdAt, { short: true })}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 10 }}>
          {renderContent(post.content, navigate)}
        </div>

        {/* Mood */}
        {post.mood && (
          <div style={{ marginBottom: 10 }}>
            <span className="mood-pill">{post.mood}</span>
          </div>
        )}

        {/* Images */}
        {(post.imageUrls || []).length > 0 && (
          <div style={{ marginBottom: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(post.imageUrls || []).map((url, i) => (
              <img
                key={i}
                src={url}
                alt="post"
                style={{ width: (post.imageUrls.length === 1) ? '100%' : 'calc(50% - 2px)', height: 160, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6' }}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button className={`action-btn ${post.liked ? 'liked' : ''}`} onClick={handleLike}>
            ♥ {post.likesCount}
          </button>
          <button className="action-btn" onClick={() => setShowModal(true)}>
            ◎ {post.commentsCount}
          </button>
          <button
            className={`action-btn ${post.bookmarked ? '' : ''}`}
            onClick={handleBookmark}
            style={{ color: post.bookmarked ? '#7F77DD' : undefined }}
          >
            {post.bookmarked ? '⊌' : '↗'} {post.bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {showModal && (
        <PostModal
          post={post}
          onClose={() => setShowModal(false)}
          onLike={handleLike}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
