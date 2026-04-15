import api from './axios'

export const getBookmarks = () => api.get('/bookmarks')
export const addBookmark = (postId) => api.post(`/bookmarks/${postId}`)
export const removeBookmark = (postId) => api.delete(`/bookmarks/${postId}`)
