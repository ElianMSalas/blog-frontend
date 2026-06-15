// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrar } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
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
      localStorage.setItem('token', data.token)
      navigate('/posts')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={enviando}
          className="bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {enviando ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        <p className="text-sm text-center text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">Inicia sesión</a>
        </p>
      </form>
    </div>
  )
}