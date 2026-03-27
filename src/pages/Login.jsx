import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Login() {
const [isRegister, setIsRegister] = useState(false)
const [email, setEmail]           = useState('')
const [password, setPassword]     = useState('')
const [loading, setLoading]       = useState(false)
const [error, setError]           = useState(null)
const [success, setSuccess]       = useState(null)

const { signIn, signUp } = useAuthStore()
const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
    if (isRegister) {
        await signUp(email, password)
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
    } else {
        await signIn(email, password)
        navigate('/')
        }
    } catch (err) {
      // Traducir errores comunes al español
    const errorMessages = {
        'Invalid login credentials':        'Email o contraseña incorrectos',
        'Email not confirmed':              'Confirma tu email antes de iniciar sesión',
        'User already registered':          'Este email ya está registrado',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    }
    setError(errorMessages[err.message] || err.message)
    } finally {
    setLoading(false)
    }
}

return (
    <div className="min-h-screen flex items-center justify-center px-4">

      {/* Fondo con luces */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl" />
    </div>

    <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2">
            <span className="font-orbitron font-black text-2xl text-neon-cyan glow-cyan">ARI</span>
            <span className="font-orbitron font-black text-2xl text-neon-purple glow-purple">VERSE</span>
        </Link>
        <p className="text-gray-500 text-sm mt-2">
            {isRegister ? 'Crea tu cuenta gratis' : 'Bienvenido de vuelta'}
        </p>
        </div>

        {/* Card del formulario */}
        <div className="glass rounded-2xl p-8 border border-dark-border">

          {/* Tabs */}
        <div className="flex rounded-xl bg-dark-bg p-1 mb-6">
            <button
            onClick={() => { setIsRegister(false); setError(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${!isRegister ? 'bg-neon-purple text-white' : 'text-gray-500 hover:text-white'}`}
            >
            Iniciar Sesión
            </button>
            <button
            onClick={() => { setIsRegister(true); setError(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isRegister ? 'bg-neon-purple text-white' : 'text-gray-500 hover:text-white'}`}
            >
            Registrarse
            </button>
        </div>

          {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white placeholder-gray-600 text-sm
                        focus:outline-none focus:border-neon-purple transition-all"
            />
            </div>

            {/* Contraseña */}
            <div>
            <label className="text-gray-400 text-sm mb-1 block">Contraseña</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white placeholder-gray-600 text-sm
                        focus:outline-none focus:border-neon-purple transition-all"
            />
            </div>

            {/* Error */}
            {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
            )}

            {/* Success */}
            {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                <p className="text-green-400 text-sm">{success}</p>
            </div>
            )}

            {/* Botón submit */}
            <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                        text-white font-semibold transition-all duration-300
                        hover:shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed
                        mt-2"
            >
            {loading
                ? 'Cargando...'
                : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'
            }
            </button>
        </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
        Al registrarte aceptas los términos de uso de AriVerse
        </p>
    </div>
    </div>
)
}

export default Login