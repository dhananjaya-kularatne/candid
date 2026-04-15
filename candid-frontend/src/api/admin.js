import api from './axios'

export const getStats = () => api.get('/admin/stats')

export const getAdminUsers = (search = '', page = 0) =>
  api.get(`/admin/users?search=${encodeURIComponent(search)}&page=${page}`)
export const banUser = (id) => api.put(`/admin/users/${id}/ban`)
export const unbanUser = (id) => api.put(`/admin/users/${id}/unban`)
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`)

export const getAdminPosts = (mood = '', page = 0) =>
  api.get(`/admin/posts?mood=${encodeURIComponent(mood)}&page=${page}`)
export const deleteAdminPost = (id) => api.delete(`/admin/posts/${id}`)

export const getReports = (page = 0) => api.get(`/admin/reports?page=${page}`)
export const dismissReport = (id) => api.put(`/admin/reports/${id}/dismiss`)
export const resolveReport = (id) => api.put(`/admin/reports/${id}/delete-post`)

export const getAdminHashtags = (page = 0) => api.get(`/admin/hashtags?page=${page}`)
export const toggleTrending = (id) => api.put(`/admin/hashtags/${id}/toggle-trending`)

export const sendAnnouncement = (data) => api.post('/admin/announcements', data)
