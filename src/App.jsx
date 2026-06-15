import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Posts      from './pages/Posts'
import CrearPost  from './pages/CreatePost'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/posts"       element={<Posts />} />
        <Route path="/posts/nuevo" element={<CrearPost />} />
      </Routes>
    </BrowserRouter>
  )
}