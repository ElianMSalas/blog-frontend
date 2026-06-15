import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Interceptor: agrega el token automáticamente a TODA petición protegida
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// AUTH
export const registrar = (datos) => api.post('/auth/register', datos)
export const iniciarSesion = (datos) => api.post('/auth/login', datos)

// POSTS
export const obtenerPosts = (params = {}) => api.get('/posts', { params })
export const obtenerPostsById = (id) => api.get(`/posts/id/${id}`)
export const obtenerPostsSlug = (slug) => api.get(`/posts/${slug}`)
export const crearPost = (datos) => api.post('/posts', datos)
export const editarPost = (slug, datos) => api.patch(`/posts/${slug}`, datos)
export const eliminarPost = (slug) => api.delete(`/posts/${slug}`)

// Comentarios
export const obtenerComentarios = (postId) => api.get(`/posts/${postId}/comments`)
export const crearComentario = (postId, datos) => api.post(`/posts/${postId}/comments`, datos)
export const editarComentario = (commentId, datos) => api.patch(`/comments/${commentId}`, datos)
export const eliminarComentario = (commentId) => api.delete(`/comments/${commentId}`)
