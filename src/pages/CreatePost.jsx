import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearPost } from '../services/api'

export default function CrearPost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', tags: '' })
  const [error, setError] = useState(null)
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
      // Si el token venció o no existe, la API devuelve 401
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      setError(err.response?.data?.message || 'Error al crear el post')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo post</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Contenido"
          rows={8}
          required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags separados por coma (ej: react, javascript)"
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={enviando}
          className="bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {enviando ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </main>
  )
}