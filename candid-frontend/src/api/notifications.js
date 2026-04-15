import api from './axios'

export const getNotifications = (page = 0) => api.get(`/notifications?page=${page}`)
export const getUnreadCount = () => api.get('/notifications/count')
export const markAllRead = () => api.put('/notifications/read-all')
