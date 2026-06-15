import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { obtenerPostsSlug, eliminarPost, editarPost,
         obtenerComentarios, crearComentario,
         editarComentario, eliminarComentario } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function PostDetalle() {
  const { slug }       = useParams()
  const navigate       = useNavigate()
  const { usuario }    = useAuth()

  const [post, setPost]               = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [cargando, setCargando]       = useState(true)
  const [error, setError]             = useState(null)

  // Comentario nuevo
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviando, setEnviando]               = useState(false)

  // Editar comentario
  const [editandoId, setEditandoId]       = useState(null)
  const [textoEdicion, setTextoEdicion]   = useState('')

  // Editar post
  const [editandoPost, setEditandoPost] = useState(false)
  const [formPost, setFormPost]         = useState({})

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await obtenerPostsSlug(slug)
        setPost(data.data)
        setFormPost({
          title:   data.data.title,
          content: data.data.content,
          excerpt: data.data.excerpt ?? '',
          tags:    data.data.tags?.join(', ') ?? '',
          status:  data.data.status,
        })
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

  // ── Acciones del post ──────────────────────────────────────────────────────

  const handleEliminarPost = async () => {
    if (!confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return
    try {
      await eliminarPost(post.slug)
      navigate('/posts')
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar')
    }
  }

  const handleGuardarPost = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formPost,
        tags: formPost.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }
      const { data } = await editarPost(post.slug, payload)
      setPost(data.data)
      setEditandoPost(false)
      navigate(`/posts/${data.data.slug}`, { replace: true })
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar')
    }
  }

  // ── Acciones de comentarios ────────────────────────────────────────────────

  const handleCrearComentario = async (e) => {
    e.preventDefault()
    if (!usuario) { navigate('/login'); return }
    setEnviando(true)
    try {
      const { data } = await crearComentario(post._id, { content: nuevoComentario })
      setComentarios([data.data, ...comentarios])
      setNuevoComentario('')
    } catch (err) {
      if (err.response?.status === 401) { navigate('/login'); return }
      alert(err.response?.data?.message || 'Error al comentar')
    } finally {
      setEnviando(false)
    }
  }

  const handleEditarComentario = async (comentarioId) => {
    try {
      const { data } = await editarComentario(comentarioId, { content: textoEdicion })
      setComentarios(comentarios.map((c) => c._id === comentarioId ? data.data : c))
      setEditandoId(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Error al editar')
    }
  }

  const handleEliminarComentario = async (comentarioId) => {
    if (!confirm('¿Eliminar este comentario?')) return
    try {
      await eliminarComentario(comentarioId)
      setComentarios(comentarios.filter((c) => c._id !== comentarioId))
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar')
    }
  }

  // ── Permisos ───────────────────────────────────────────────────────────────
  const esAutorPost = usuario && post && (
    usuario.id === post.author?._id || usuario.role === 'admin'
  )
  const puedeEliminarComentario = (comentario) => usuario && (
    usuario.id === comentario.author?._id ||
    usuario.id === post?.author?._id ||
    usuario.role === 'admin'
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  if (cargando) return <><Navbar /><p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p></>
  if (error)    return <><Navbar /><p className="text-center mt-10 text-red-500">{error}</p></>

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">

        <Link to="/posts" className="text-sm text-indigo-600 hover:underline mb-6 block">
          ← Volver a posts
        </Link>

        {/* ── Post ── */}
        {editandoPost ? (
          <form onSubmit={handleGuardarPost} className="flex flex-col gap-4 mb-10">
            <h2 className="text-xl font-bold text-gray-900">Editar post</h2>
            <input value={formPost.title}
              onChange={(e) => setFormPost({ ...formPost, title: e.target.value })}
              placeholder="Título" required
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <textarea value={formPost.content} rows={8}
              onChange={(e) => setFormPost({ ...formPost, content: e.target.value })}
              placeholder="Contenido" required
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            <input value={formPost.excerpt}
              onChange={(e) => setFormPost({ ...formPost, excerpt: e.target.value })}
              placeholder="Resumen (opcional)"
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <input value={formPost.tags}
              onChange={(e) => setFormPost({ ...formPost, tags: e.target.value })}
              placeholder="Tags separados por coma"
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <select value={formPost.status}
              onChange={(e) => setFormPost({ ...formPost, status: e.target.value })}
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
            <div className="flex gap-3">
              <button type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition">
                Guardar
              </button>
              <button type="button" onClick={() => setEditandoPost(false)}
                className="text-gray-500 hover:text-gray-700 px-4 py-2">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags?.map((t) => (
                <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <p className="text-sm text-gray-400 mb-6">
              Por {post.author?.name} · {new Date(post.createdAt).toLocaleDateString('es-CL')}
            </p>

            {esAutorPost && (
              <div className="flex gap-3 mb-6">
                <button onClick={() => setEditandoPost(true)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-xl transition">
                  ✏️ Editar
                </button>
                <button onClick={handleEliminarPost}
                  className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-xl transition">
                  🗑 Eliminar post
                </button>
              </div>
            )}

            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </>
        )}

        {/* ── Comentarios ── */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Comentarios ({comentarios.length})
          </h2>

          {/* Formulario nuevo comentario */}
          {usuario ? (
            <form onSubmit={handleCrearComentario} className="flex flex-col gap-3 mb-8">
              <textarea value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={3} required
                className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              <button type="submit" disabled={enviando}
                className="self-end bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
                {enviando ? 'Enviando...' : 'Comentar'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-8">
              <Link to="/login" className="text-indigo-600 hover:underline">Inicia sesión</Link> para comentar.
            </p>
          )}

          {comentarios.length === 0 && (
            <p className="text-gray-400 text-sm">Sin comentarios aún.</p>
          )}

          <div className="flex flex-col gap-4">
            {comentarios.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded-xl shadow">
                {editandoId === c._id ? (
                  <div className="flex flex-col gap-2">
                    <textarea value={textoEdicion}
                      onChange={(e) => setTextoEdicion(e.target.value)}
                      rows={2}
                      className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => handleEditarComentario(c._id)}
                        className="text-sm bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition">
                        Guardar
                      </button>
                      <button onClick={() => setEditandoId(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-700">{c.author?.name}</p>
                      <div className="flex gap-2">
                        {/* Editar: solo el autor del comentario */}
                        {usuario?.id === c.author?._id && (
                          <button onClick={() => { setEditandoId(c._id); setTextoEdicion(c.content) }}
                            className="text-xs text-gray-400 hover:text-indigo-600 transition">
                            Editar
                          </button>
                        )}
                        {/* Eliminar: autor del comentario, autor del post o admin */}
                        {puedeEliminarComentario(c) && (
                          <button onClick={() => handleEliminarComentario(c._id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition">
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">{c.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}