import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navLinks = [
{ path: '/',           label: 'Inicio' },
{ path: '/directorio', label: 'Directorio' },
{ path: '/top',        label: 'Top Anime' },
{ path: '/noticias',   label: 'Noticias' },
{ path: '/calendario', label: 'Calendario' },
{ path: '/mi-lista',   label: 'Mi Lista' },
]

function Navbar() {
const [menuOpen, setMenuOpen] = useState(false)
const location  = useLocation()
const { user, signOut } = useAuthStore()

const isActive = (path) => location.pathname === path

const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
}

return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
            <span className="font-orbitron font-black text-xl text-neon-cyan glow-cyan">ARI</span>
            <span className="font-orbitron font-black text-xl text-neon-purple glow-purple">VERSE</span>
        </Link>

          {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
            <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isActive(link.path)
                    ? 'text-neon-cyan bg-neon-cyan/10 shadow-neon-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {link.label}
            </Link>
            ))}
        </div>

          {/* Auth desktop */}
        {user ? (
<div className="flex items-center gap-3">

    {user?.email === 'yahirp827@gmail.com' && (
<Link
    to="/admin/noticias"
    className="px-3 py-2 rounded-lg border border-dark-border text-gray-400
            hover:border-neon-purple hover:text-neon-purple transition-all text-sm"
    title="Panel de Admin"
>
    ⚙️
</Link>
)}

    <Link
    to="/perfil"
    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 
                transition-all group"
    >
    <div className="w-7 h-7 rounded-full bg-neon-purple/30 border border-neon-purple/50
                    flex items-center justify-center group-hover:border-neon-purple transition-all">
        <span className="text-neon-purple text-xs font-bold">
        {user.email?.[0].toUpperCase()}
        </span>
    </div>
    <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
        {user.email?.split('@')[0]}
    </span>
    </Link>
    <button
    onClick={handleSignOut}
    className="px-4 py-2 rounded-lg border border-dark-border text-gray-400
                text-sm hover:border-red-500 hover:text-red-400 transition-all"
    >
    Salir
    </button>
</div>
            ) : (
            <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-neon-purple text-neon-purple
                        text-sm font-medium hover:bg-neon-purple hover:text-white
                        transition-all duration-300 hover:shadow-neon-purple"
            >
                Iniciar Sesión
            </Link>
            )}
        </div>

          {/* Hamburguesa mobile */}
        <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
        >
            <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-6 h-0.5 bg-current my-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>

        </div>

      {/* Menú mobile */}
        {menuOpen && (
        <div className="md:hidden border-t border-dark-border px-4 py-3 flex flex-col gap-1">
        {navLinks.map((link) => (
            <Link
            key={link.path}
            to={link.path}
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isActive(link.path)
                ? 'text-neon-cyan bg-neon-cyan/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
            {link.label}
            </Link>
        ))}
        {user ? (
            <button
            onClick={handleSignOut}
            className="mt-2 px-4 py-2 rounded-lg border border-red-500/50
                        text-red-400 text-sm text-center transition-all"
            >
            Cerrar Sesión
            </button>
        ) : (
            <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-2 rounded-lg border border-neon-purple text-neon-purple
                        text-sm font-medium text-center hover:bg-neon-purple hover:text-white
                        transition-all duration-300"
            >
            Iniciar Sesión
            </Link>
        )}
        </div>
    )}
    </nav>
)
}

export default Navbar