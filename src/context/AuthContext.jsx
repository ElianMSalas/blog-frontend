import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const guardado = localStorage.getItem('usuario')
        if (token && guardado) {
            setUsuario(JSON.parse(guardado))
        }
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
        <AuthContext.Provider value = {{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)