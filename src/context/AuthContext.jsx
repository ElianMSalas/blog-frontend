import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const guardado = localStorage.getItem('usuario')
        if (token && guardado) {
            setUsuario(JSON.parse(guardado))
        }
        setCargando(false)
    }, [])

    const login = (token, user) => {
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(user))
        setUsuario(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value = {{ usuario, cargando, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)