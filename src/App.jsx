import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Posts      from './pages/Posts'
import CrearPost  from './pages/CreatePost'
import PostDetalle from './pages/PostDetalle'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/posts" />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/posts"       element={<Posts />} />
        <Route path="/posts/nuevo" element={<CrearPost />} />
        <Route path="/posts/:slug"   element={<PostDetalle />} />
      </Routes>
    </BrowserRouter>
  )
}