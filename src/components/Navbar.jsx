import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onBuscar }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  const handleBuscar = (e) => {
    e.preventDefault()
    if (busqueda.trim()) {
      navigate(`/posts?tag=${busqueda.trim()}`)
    } else {
      navigate('/posts')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex flex-wrap items-center gap-4">
      <Link to="/posts" className="text-xl font-bold text-indigo-600 shrink-0">
        Blog
      </Link>

      {/* Buscador */}
      <form onSubmit={handleBuscar} className="flex gap-2 flex-1 min-w-[200px]">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por tag..."
          className="border rounded-xl px-4 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-xl text-sm hover:bg-indigo-200 transition"
        >
          Buscar
        </button>
      </form>

      <div className="flex items-center gap-3 shrink-0">
        {usuario ? (
          <>
            <span className="text-sm text-gray-600 hidden sm:block">
              Hola, <strong>{usuario.name}</strong>
            </span>
            <Link
              to="/posts/nuevo"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-indigo-700 transition"
            >
              + Nuevo post
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-indigo-700 transition"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}