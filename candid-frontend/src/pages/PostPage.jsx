import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostCard } from '../components/Post';
import API from '../api/axios';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280', lineHeight: 1 }}
        >
          ←
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Post</span>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
      ) : post ? (
        <PostCard post={post} />
      ) : null}
    </div>
  );
};

export default PostPage;
