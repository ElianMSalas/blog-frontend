import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearPost } from '../services/api'
import Navbar from '../components/Navbar'

export default function CrearPost() {
  const navigate        = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', tags: '', status: 'published' })
  const [error, setError]       = useState(null)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await crearPost({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
      navigate('/posts')
    } catch (err) {
      if (err.response?.status === 401) { navigate('/login'); return }
      setError(err.response?.data?.message || 'Error al crear el post')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo post</h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="Título (mín. 5 caracteres)" required
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

          <textarea name="content" value={form.content} onChange={handleChange}
            placeholder="Contenido (mín. 10 caracteres)" rows={10} required
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />

          <input name="excerpt" value={form.excerpt} onChange={handleChange}
            placeholder="Resumen corto (opcional)"
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

          <input name="tags" value={form.tags} onChange={handleChange}
            placeholder="Tags separados por coma (ej: react, javascript)"
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

          <select name="status" value={form.status} onChange={handleChange}
            className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>

          <button type="submit" disabled={enviando}
            className="bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </main>
    </>
  )
}