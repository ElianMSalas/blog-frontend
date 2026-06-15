import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerPosts } from '../services/api'
import Navbar from '../components/Navbar'

export default function Posts() {
  const [posts, setPosts]       = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState(null)
  const [tag, setTag]           = useState('')

  const cargar = async (tagFiltro = '') => {
    setCargando(true)
    setError(null)
    try {
      const params = tagFiltro ? { tag: tagFiltro } : {}
      const { data } = await obtenerPosts(params)
      setPosts(data.data.posts)
    } catch (err) {
      setError('Error al cargar los posts')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleBuscar = (valor) => {
    setTag(valor)
    cargar(valor)
  }

  return (
    <>
      <Navbar onBuscar={handleBuscar} />
      <main className="max-w-3xl mx-auto px-6 py-10">

        {tag && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Filtrando por tag:</span>
            <span className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">{tag}</span>
            <button onClick={() => handleBuscar('')} className="text-xs text-gray-400 hover:text-red-500">
              ✕ limpiar
            </button>
          </div>
        )}

        {cargando && <p className="text-center text-gray-400 animate-pulse mt-10">Cargando...</p>}
        {error   && <p className="text-center text-red-500 mt-10">{error}</p>}

        {!cargando && !error && posts.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No hay posts publicados.</p>
        )}

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link key={post._id} to={`/posts/${post.slug}`}
              className="block bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags?.map((t) => (
                  <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-500 mt-1 text-sm">
                {post.excerpt ?? post.content?.slice(0, 120)}...
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Por {post.author?.name} · {new Date(post.createdAt).toLocaleDateString('es-CL')}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}