import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerPosts } from '../services/api'

export default function Posts() {
  const [posts, setPosts]       = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await obtenerPosts()
        // Ajusta según lo que devuelva tu API: data.posts, data.data, etc.
        setPosts(data.data.posts ?? data)
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar posts')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  if (cargando) return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>
  if (error)    return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Posts</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/posts/${post.slug}`}
            className="block bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-gray-500 mt-1 text-sm">{post.excerpt ?? post.content?.slice(0, 120)}...</p>
          </Link>
        ))}
      </div>
    </main>
  )
}