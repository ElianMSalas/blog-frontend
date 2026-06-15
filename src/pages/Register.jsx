import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registrar } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const { data } = await registrar(form)
      login(data.data.token, data.data.user)
      navigate('/posts')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Link to="/posts" className="text-indigo-600 font-bold text-xl mb-8">
        ← Volver al blog
      </Link>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <input name="name" value={form.name} onChange={handleChange}
          placeholder="Nombre" required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <input name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="Email" required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <input name="password" type="password" value={form.password} onChange={handleChange}
          placeholder="Contraseña (mín. 6 caracteres)" required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <button type="submit" disabled={enviando}
          className="bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
          {enviando ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        <p className="text-sm text-center text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}