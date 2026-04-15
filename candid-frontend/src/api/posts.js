import api from './axios'

export const createPost = (formData) =>
  api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getFeed = (page = 0) => api.get(`/posts/feed?page=${page}`)
export const getDiscover = (page = 0) => api.get(`/posts/discover?page=${page}`)
export const getPost = (id) => api.get(`/posts/${id}`)
export const deletePost = (id) => api.delete(`/posts/${id}`)
export const getUserPosts = (username) => api.get(`/posts/user/${username}`)
export const searchPosts = (q, page = 0) => api.get(`/posts/search?q=${encodeURIComponent(q)}&page=${page}`)

export const likePost = (id) => api.post(`/posts/${id}/like`)
export const unlikePost = (id) => api.delete(`/posts/${id}/like`)

export const getComments = (id) => api.get(`/posts/${id}/comments`)
export const addComment = (id, content) => api.post(`/posts/${id}/comments`, { content })
export const deleteComment = (id) => api.delete(`/comments/${id}`)

export const reportPost = (id, reason) => api.post(`/posts/${id}/report`, { reason })
