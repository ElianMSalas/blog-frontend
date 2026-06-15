import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerPostsSlug, obtenerComentarios, crearComentario } from '../services/api'

export default function PostDetalle() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [post, setPost]             = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [cargando, setCargando]     = useState(true)
  const [error, setError]           = useState(null)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviando, setEnviando]     = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await obtenerPostsSlug(slug)
        setPost(data.data)

        const res = await obtenerComentarios(data.data._id)
        setComentarios(res.data.data.comments ?? [])
      } catch (err) {
        setError(err.response?.data?.message || 'Post no encontrado')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [slug])

  const handleComentario = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const { data } = await crearComentario(post._id, { content: nuevoComentario })
      setComentarios([...comentarios, data.data])
      setNuevoComentario('')
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
        return
      }
      alert(err.response?.data?.message || 'Error al comentar')
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>
  if (error)    return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">

      {/* Post */}
      <button
        onClick={() => navigate('/posts')}
        className="text-sm text-indigo-600 hover:underline mb-6 block"
      >
        ← Volver a posts
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-8">
        Por {post.author?.name} · {new Date(post.createdAt).toLocaleDateString('es-CL')}
      </p>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {/* Comentarios */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comentarios ({comentarios.length})
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          {comentarios.length === 0 && (
            <p className="text-gray-400 text-sm">Sé el primero en comentar.</p>
          )}
          {comentarios.map((c) => (
            <div key={c._id} className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm font-medium text-gray-700">{c.author?.name}</p>
              <p className="text-gray-600 mt-1">{c.content}</p>
            </div>
          ))}
        </div>

        {/* Formulario nuevo comentario */}
        <form onSubmit={handleComentario} className="flex flex-col gap-3">
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe un comentario... (debes iniciar sesión)"
            rows={3}
            required
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <button
            type="submit"
            disabled={enviando}
            className="self-end bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {enviando ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      </section>
    </main>
  )
}