import api from './axios'

export const search = (q) => api.get(`/search?q=${encodeURIComponent(q)}`)
