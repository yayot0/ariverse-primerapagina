import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { eliminarNoticia, getNoticiasAdmin } from '../../services/noticiasService'
import { useAuthStore } from '../../store/authStore'

// Cambia este email por el tuyo
const ADMIN_EMAIL = 'yahirp827@gmail.com'

function AdminNoticias() {
const { user }                  = useAuthStore()
const navigate                  = useNavigate()
const [noticias, setNoticias]   = useState([])
const [loading, setLoading]     = useState(true)

  // Proteger la ruta — solo el admin puede entrar
useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); return }

    getNoticiasAdmin()
    .then(data => setNoticias(data))
    .finally(() => setLoading(false))
}, [user])

const handleEliminar = async (id, titulo) => {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return
    try {
    await eliminarNoticia(id)
    setNoticias(prev => prev.filter(n => n.id !== id))
    } catch {
    alert('Error al eliminar')
    }
}

if (!user || user.email !== ADMIN_EMAIL) return null

return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
    <div className="flex items-center justify-between mb-8">
        <div>
        <h1 className="font-orbitron font-bold text-3xl text-white">
            Panel de <span className="text-neon-cyan">Noticias</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Administra los artículos de AriVerse</p>
        </div>
        <Link
        to="/admin/noticias/nueva"
        className="px-5 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                    text-white font-medium transition-all hover:shadow-neon-purple
                    flex items-center gap-2"
        >
        + Nueva Noticia
        </Link>
    </div>

      {/* Stats rápidas */}
    <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center border border-dark-border">
        <p className="font-orbitron font-bold text-2xl text-neon-cyan">{noticias.length}</p>
        <p className="text-gray-500 text-xs mt-1">Total</p>
        </div>
        <div className="glass rounded-xl p-4 text-center border border-dark-border">
        <p className="font-orbitron font-bold text-2xl text-green-400">
            {noticias.filter(n => n.published).length}
        </p>
        <p className="text-gray-500 text-xs mt-1">Publicadas</p>
        </div>
        <div className="glass rounded-xl p-4 text-center border border-dark-border">
        <p className="font-orbitron font-bold text-2xl text-yellow-400">
            {noticias.filter(n => !n.published).length}
        </p>
        <p className="text-gray-500 text-xs mt-1">Borradores</p>
        </div>
    </div>

      {/* Lista de noticias */}
    {loading ? (
        <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-dark-card rounded-xl animate-pulse" />
        ))}
        </div>
    ) : (
        <div className="flex flex-col gap-3">
        {noticias.map(noticia => (
            <div
            key={noticia.id}
            className="flex items-center gap-4 p-4 bg-dark-card border border-dark-border
                        rounded-xl hover:border-neon-purple/50 transition-all"
            >
              {/* Imagen */}
            <img
                src={noticia.imagen}
                alt={noticia.titulo}
                className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
            />

              {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium line-clamp-1">
                {noticia.titulo}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{noticia.categoria}</span>
                <span>•</span>
                <span>{new Date(noticia.created_at).toLocaleDateString('es-MX')}</span>
                <span
                    className={`px-2 py-0.5 rounded-full border text-xs
                    ${noticia.published
                        ? 'text-green-400 border-green-400/30 bg-green-400/10'
                        : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                    }`}
                >
                    {noticia.published ? 'Publicado' : 'Borrador'}
                </span>
                </div>
            </div>

              {/* Acciones */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                to={`/noticias/${noticia.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg border border-dark-border text-gray-400
                            hover:border-neon-cyan hover:text-neon-cyan transition-all text-xs"
                >
                Ver
                </Link>
                <Link
                to={`/admin/noticias/editar/${noticia.id}`}
                className="px-3 py-1.5 rounded-lg border border-dark-border text-gray-400
                            hover:border-neon-purple hover:text-neon-purple transition-all text-xs"
                >
                Editar
                </Link>
                <button
                onClick={() => handleEliminar(noticia.id, noticia.titulo)}
                className="px-3 py-1.5 rounded-lg border border-dark-border text-gray-400
                            hover:border-red-500 hover:text-red-400 transition-all text-xs"
                >
                Eliminar
                </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </div>
)
}

export default AdminNoticias