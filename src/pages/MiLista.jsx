import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import { actualizarEstado, eliminarAnime, getMiLista } from '../services/listaService'
import { useAuthStore } from '../store/authStore'

const TABS = [
  { value: 'todos',      label: '🎌 Todos' },
  { value: 'viendo',     label: '▶️ Viendo' },
  { value: 'completado', label: '✅ Completado' },
  { value: 'pendiente',  label: '⏳ Pendiente' },
  { value: 'favorito',   label: '❤️ Favorito' },
]

const STATUS_COLORS = {
  viendo:     'text-neon-cyan   border-neon-cyan/30   bg-neon-cyan/10',
  completado: 'text-green-400  border-green-400/30  bg-green-400/10',
  pendiente:  'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  favorito:   'text-neon-pink  border-neon-pink/30  bg-neon-pink/10',
}

// ─── Card de anime en la lista ────────────────────────────────────────────────
function AnimeListaCard({ item, onStatusChange, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="group flex gap-4 p-4 bg-dark-card border border-dark-border
                    rounded-xl hover:border-neon-purple transition-all duration-300">

      {/* Imagen */}
      <Link to={`/anime/${item.anime_id}`} className="flex-shrink-0">
        <img
          src={item.anime_image}
          alt={item.anime_title}
          className="w-14 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/anime/${item.anime_id}`}
          className="font-medium text-white hover:text-neon-cyan transition-colors
                  line-clamp-2 text-sm block mb-2"
        >
          {item.anime_title}
        </Link>

        {/* Badge de estado */}
        <div className="relative inline-block">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`text-xs px-3 py-1 rounded-full border transition-all
                        ${STATUS_COLORS[item.status]}`}
          >
            {TABS.find(t => t.value === item.status)?.label} ▼
          </button>

          {/* Dropdown cambiar estado */}
          {menuOpen && (
            <div className="absolute top-8 left-0 z-20 bg-dark-card border border-dark-border
                            rounded-xl overflow-hidden shadow-xl min-w-40">
              {TABS.filter(t => t.value !== 'todos').map(tab => (
                <button
                  key={tab.value}
                  onClick={() => {
                    onStatusChange(item.anime_id, tab.value)
                    setMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5
                            transition-colors ${STATUS_COLORS[tab.value]?.split(' ')[0]}
                            ${item.status === tab.value ? 'bg-white/5' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fecha agregado */}
        <p className="text-gray-600 text-xs mt-2">
          Agregado: {new Date(item.created_at).toLocaleDateString('es-MX')}
        </p>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => onDelete(item.anime_id)}
        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400
                  transition-all self-start p-1 text-lg"
        title="Eliminar de la lista"
      >
        🗑️
      </button>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
function MiLista() {
  const { user }              = useAuthStore()
  const [lista, setLista]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [tabActiva, setTabActiva] = useState('todos')

  const fetchLista = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await getMiLista(user.id)
      setLista(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchLista()
  }, [fetchLista])

  const handleStatusChange = async (animeId, newStatus) => {
    try {
      await actualizarEstado({ userId: user.id, animeId, status: newStatus })
      setLista(prev => prev.map(item =>
        item.anime_id === animeId ? { ...item, status: newStatus } : item
      ))
    } catch {
      alert('Error al actualizar')
    }
  }

  const handleDelete = async (animeId) => {
    if (!confirm('¿Eliminar este anime de tu lista?')) return
    try {
      await eliminarAnime({ userId: user.id, animeId })
      setLista(prev => prev.filter(item => item.anime_id !== animeId))
    } catch {
      alert('Error al eliminar')
    }
  }

  // Filtrar por tab activa
  const listaFiltrada = tabActiva === 'todos'
    ? lista
    : lista.filter(item => item.status === tabActiva)

  // Conteo por categoría
  const counts = TABS.reduce((acc, tab) => {
    acc[tab.value] = tab.value === 'todos'
      ? lista.length
      : lista.filter(i => i.status === tab.value).length
    return acc
  }, {})

  // Si no hay sesión
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🔐</p>
        <h2 className="font-orbitron font-bold text-2xl text-white mb-2">
          Inicia Sesión
        </h2>
        <p className="text-gray-500 mb-6">
          Necesitas una cuenta para guardar tu lista de animes
        </p>
        <Link to="/login"
          className="px-8 py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                    text-white font-semibold transition-all hover:shadow-neon-purple">
          Ir al Login
        </Link>
      </div>
    </div>
  )

  return (
    <PageTransition>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron font-bold text-4xl text-white mb-2">
          Mi <span className="text-neon-pink glow-pink">Lista</span>
        </h1>
        <p className="text-gray-500">
          Tu colección personal de animes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setTabActiva(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
              flex items-center gap-2
              ${tabActiva === tab.value
                ? 'bg-neon-purple text-white shadow-neon-purple'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-purple hover:text-white'
              }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full
              ${tabActiva === tab.value ? 'bg-white/20' : 'bg-dark-border'}`}>
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-dark-card rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Lista */}
      {!loading && !error && (
        <>
          {listaFiltrada.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">
                {tabActiva === 'todos' ? '🎌' : TABS.find(t => t.value === tabActiva)?.label}
              </p>
              <p className="text-gray-400 font-medium">
                {tabActiva === 'todos'
                  ? 'Tu lista está vacía'
                  : `No tienes animes en "${TABS.find(t => t.value === tabActiva)?.label}"`
                }
              </p>
              <p className="text-gray-600 text-sm mt-2 mb-6">
                Explora el directorio y agrega animes a tu colección
              </p>
              <Link to="/directorio"
                className="px-6 py-2 rounded-xl border border-neon-purple text-neon-purple
                          hover:bg-neon-purple hover:text-white transition-all text-sm">
                Ir al Directorio
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listaFiltrada.map(item => (
                <AnimeListaCard
                  key={item.id}
                  item={item}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
    </PageTransition>
  )
}

export default MiLista