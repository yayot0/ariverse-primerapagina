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

const { signIn, signUp, signInWithGoogle } = useAuthStore()
const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

const handleGoogle = async () => {
try {
    setError(null)
    await signInWithGoogle()
} catch {
    setError('Error al iniciar sesión con Google')
}
}

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

{/* Divisor */}
<div className="flex items-center gap-3 my-2">
<div className="flex-1 h-px bg-dark-border" />
<span className="text-gray-600 text-xs">o continúa con</span>
<div className="flex-1 h-px bg-dark-border" />
</div>

{/* Botón Google */}
<button
type="button"
onClick={handleGoogle}
className="w-full py-3 rounded-xl border border-dark-border bg-dark-bg
            text-white text-sm font-medium hover:border-white/30
            transition-all duration-300 flex items-center justify-center gap-3"
>
<svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
</svg>
Continuar con Google
</button>

export default Login