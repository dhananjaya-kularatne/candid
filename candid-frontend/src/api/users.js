import api from './axios'

export const getUser = (username) => api.get(`/users/${username}`)
export const updateProfile = (formData) =>
  api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getSuggestedUsers = () => api.get('/users/suggested')
export const searchUsers = (q, page = 0) => api.get(`/users/search?q=${encodeURIComponent(q)}&page=${page}`)

export const followUser = (username) => api.post(`/follow/${username}`)
export const unfollowUser = (username) => api.delete(`/follow/${username}`)
export const getFollowers = (username) => api.get(`/follow/${username}/followers`)
export const getFollowing = (username) => api.get(`/follow/${username}/following`)
