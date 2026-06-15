import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { iniciarSesion } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const { data } = await iniciarSesion(form)
      login(data.data.token, data.data.user)
      navigate('/posts')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <input name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="Email" required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <input name="password" type="password" value={form.password} onChange={handleChange}
          placeholder="Contraseña" required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <button type="submit" disabled={enviando}
          className="bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-sm text-center text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  )
}