import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReviewSection from '../components/ui/ReviewSection'
import { getAnimeById, getAnimeCharacters } from '../services/jikanApi'
import { actualizarEstado, agregarAnime, eliminarAnime, verificarEnLista } from '../services/listaService'
import { useAuthStore } from '../store/authStore'

// ─── Componente Badge ─────────────────────────────────────────────────────────
function Badge({ children, color = 'purple' }) {
const colors = {
    purple: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    cyan:   'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    pink:   'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
}
return (
    <span className={`text-xs px-3 py-1 rounded-full border ${colors[color]}`}>
    {children}
    </span>
)
}

// ─── Componente StatBox ───────────────────────────────────────────────────────
function StatBox({ label, value }) {
return (
    <div className="glass rounded-xl p-4 text-center">
    <p className="text-neon-cyan font-orbitron font-bold text-xl">{value ?? 'N/A'}</p>
    <p className="text-gray-500 text-xs mt-1">{label}</p>
    </div>
)
}

// ─── Sección Tráiler ──────────────────────────────────────────────────────────
function TrailerSection({ trailer }) {
if (!trailer?.youtube_id) return null

return (
    <section className="mb-12">
    <h2 className="font-orbitron font-bold text-xl text-white mb-6 flex items-center gap-3">
        <div className="w-1 h-6 bg-neon-pink rounded-full" />
        Tráiler
    </h2>
    <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${trailer.youtube_id}`}
        title="Trailer"
        allowFullScreen
        />
    </div>
    </section>
)
}

// ─── Sección Personajes ───────────────────────────────────────────────────────
function CharactersSection({ animeId }) {
const [characters, setCharacters] = useState(null)
const [loading, setLoading]       = useState(true)

useEffect(() => {
    getAnimeCharacters(animeId)
    .then(data => setCharacters(data?.slice(0, 12)))
    .catch(() => setCharacters([]))
    .finally(() => setLoading(false))
}, [animeId])

if (loading) return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
    {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
        <div className="aspect-[3/4] bg-dark-card rounded-lg mb-2" />
        <div className="h-3 bg-dark-card rounded w-3/4 mx-auto" />
        </div>
    ))}
    </div>
)

if (!characters?.length) return (
    <p className="text-gray-600 text-sm">No hay personajes disponibles.</p>
)

return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
    {characters.map(({ character, role }) => (
        <div key={character.mal_id} className="group text-center">
        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 
                        border border-dark-border group-hover:border-neon-purple 
                        transition-colors duration-300">
            <img
            src={character.images?.jpg?.image_url}
            alt={character.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            />
        </div>
        <p className="text-white text-xs font-medium line-clamp-1">{character.name}</p>
        <p className="text-gray-600 text-xs">{role}</p>
        </div>
    ))}
    </div>
)
}

// ─── Botón agregar a lista ────────────────────────────────────────────────────
const STATUS_OPTIONS = [
{ value: 'viendo',     label: '▶️ Viendo',     color: 'text-neon-cyan' },
{ value: 'completado', label: '✅ Completado',  color: 'text-green-400' },
{ value: 'pendiente',  label: '⏳ Pendiente',   color: 'text-yellow-400' },
{ value: 'favorito',   label: '❤️ Favorito',    color: 'text-neon-pink' },
]

function ListaButton({ anime }) {
const { user }                      = useAuthStore()
const [enLista, setEnLista]         = useState(null)
const [loading, setLoading]         = useState(true)
const [menuOpen, setMenuOpen]       = useState(false)
const [actionLoading, setActionLoading] = useState(false)

useEffect(() => {
    if (!user) { setLoading(false); return }

    verificarEnLista({ userId: user.id, animeId: anime.mal_id })
    .then(data => setEnLista(data))
    .catch(() => setEnLista(null))
    .finally(() => setLoading(false))
}, [user, anime.mal_id])

if (!user) return (
    <Link to="/login"
    className="flex items-center gap-2 px-5 py-2 rounded-xl border border-dark-border
                text-gray-400 hover:border-neon-purple hover:text-neon-purple transition-all text-sm">
    🔐 Inicia sesión para agregar a tu lista
    </Link>
)

if (loading) return (
    <div className="h-10 w-48 bg-dark-card rounded-xl animate-pulse" />
)

const handleAgregar = async (status) => {
    try {
    setActionLoading(true)
    const data = await agregarAnime({
        userId:     user.id,
        animeId:    anime.mal_id,
        animeTitle: anime.title,
        animeImage: anime.images?.jpg?.image_url,
        status,
    })
    setEnLista(data)
    setMenuOpen(false)
    } catch {
    alert('Error al agregar el anime')
    } finally {
    setActionLoading(false)
    }
}

const handleCambiarEstado = async (status) => {
    try {
    setActionLoading(true)
    const data = await actualizarEstado({
        userId:  user.id,
        animeId: anime.mal_id,
        status,
    })
    setEnLista(data)
    setMenuOpen(false)
    } catch {
    alert('Error al actualizar')
    } finally {
    setActionLoading(false)
    }
}

const handleEliminar = async () => {
    if (!confirm('¿Eliminar este anime de tu lista?')) return
    try {
    setActionLoading(true)
    await eliminarAnime({ userId: user.id, animeId: anime.mal_id })
    setEnLista(null)
    setMenuOpen(false)
    } catch {
    alert('Error al eliminar')
    } finally {
    setActionLoading(false)
    }
}

return (
    <div className="relative">
    {enLista ? (
        // Ya está en la lista
        <div className="flex items-center gap-2">
        <button
            onClick={() => setMenuOpen(!menuOpen)}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-purple/20
                    border border-neon-purple text-neon-purple hover:bg-neon-purple/30
                    transition-all text-sm font-medium"
        >
            ✅ En tu lista — {STATUS_OPTIONS.find(s => s.value === enLista.status)?.label}
            <span className="text-xs">▼</span>
        </button>
        <button
            onClick={handleEliminar}
            disabled={actionLoading}
            className="px-3 py-2 rounded-xl border border-dark-border text-gray-500
                    hover:border-red-500 hover:text-red-400 transition-all text-sm"
        >
            🗑️
        </button>
        </div>
    ) : (
        // No está en la lista
        <button
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={actionLoading}
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-purple
                    hover:bg-neon-purple/80 text-white transition-all text-sm
                    font-medium hover:shadow-neon-purple"
        >
        + Agregar a mi lista
        </button>
    )}

      {/* Dropdown de opciones */}
    {menuOpen && (
        <div className="absolute top-12 left-0 z-20 bg-dark-card border border-dark-border
                        rounded-xl overflow-hidden shadow-xl min-w-48">
        {STATUS_OPTIONS.map(opt => (
            <button
            key={opt.value}
            onClick={() => enLista ? handleCambiarEstado(opt.value) : handleAgregar(opt.value)}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5
                        transition-colors ${opt.color}
                        ${enLista?.status === opt.value ? 'bg-white/5' : ''}`}
            >
            {opt.label}
            </button>
        ))}
        </div>
    )}
    </div>
)
}

// ─── Página principal ─────────────────────────────────────────────────────────
function AnimeDetalle() {
const { id } = useParams()
const [anime, setAnime]     = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError]     = useState(null)

useEffect(() => {
window.scrollTo(0, 0)

const fetchAnime = async () => {
    try {
    setLoading(true)
    const data = await getAnimeById(id)
    setAnime(data)
    } catch (err) {
    setError(err.message)
    } finally {
    setLoading(false)
    }
}

fetchAnime()
}, [id])

  // ── Loading ──
if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-48 aspect-[3/4] bg-dark-card rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-4 pt-4">
        <div className="h-8 bg-dark-card rounded w-3/4" />
        <div className="h-4 bg-dark-card rounded w-1/2" />
        <div className="h-4 bg-dark-card rounded w-full" />
        <div className="h-4 bg-dark-card rounded w-full" />
        <div className="h-4 bg-dark-card rounded w-2/3" />
        </div>
    </div>
    </div>
)

  // ── Error ──
if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <p className="text-red-400 text-lg">Error al cargar el anime</p>
    <p className="text-gray-600 text-sm">{error}</p>
    <Link to="/directorio"
        className="px-6 py-2 rounded-lg border border-neon-purple text-neon-purple 
                hover:bg-neon-purple hover:text-white transition-all">
        ← Volver al Directorio
    </Link>
    </div>
)

if (!anime) return null

return (
    <div className="min-h-screen">

      {/* ── Hero con imagen de fondo ── */}
    <div className="relative h-64 md:h-80 overflow-hidden">
        {/* Imagen de fondo difuminada */}
        <img
        src={anime.images?.jpg?.large_image_url}
        alt=""
        className="w-full h-full object-cover scale-110 blur-sm opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-bg" />
    </div>

      {/* ── Contenido principal ── */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-32 relative z-10 pb-16">

        {/* Poster + Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">

          {/* Poster */}
        <div className="flex-shrink-0">
            <img
            src={anime.images?.jpg?.large_image_url}
            alt={anime.title}
            className="w-44 md:w-52 rounded-xl border-2 border-neon-purple shadow-neon-purple"
            />
        </div>

          {/* Info */}
        <div className="flex-1 pt-2">
            {/* Breadcrumb */}
            <Link to="/directorio"
            className="text-gray-600 text-sm hover:text-neon-cyan transition-colors mb-3 block">
            ← Volver al Directorio
            </Link>

            {/* Título */}
            <h1 className="font-orbitron font-bold text-2xl md:text-3xl text-white mb-1">
            {anime.title}
            </h1>
            {anime.title_english && anime.title_english !== anime.title && (
            <p className="text-gray-500 text-sm mb-3">{anime.title_english}</p>
            )}

            {/* Score grande */}
            <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/30 
                            rounded-xl px-4 py-2">
                <span className="text-2xl">⭐</span>
                <span className="font-orbitron font-bold text-2xl text-neon-cyan">
                {anime.score ?? 'N/A'}
                </span>
            </div>
            {anime.rank && (
                <div className="glass rounded-xl px-4 py-2">
                <span className="text-gray-400 text-sm">Rank </span>
                <span className="text-neon-purple font-bold">#{anime.rank}</span>
                </div>
            )}
            </div>

            {/* Géneros */}
            <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres?.map(g => <Badge key={g.mal_id}>{g.name}</Badge>)}
            {anime.themes?.map(t => <Badge key={t.mal_id} color="cyan">{t.name}</Badge>)}
            </div>

            {/* Botón Mi Lista */}
            <div className="mb-4">
            <ListaButton anime={anime} />
            </div>

            {/* Info rápida */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
            {anime.type     && <span>📺 {anime.type}</span>}
            {anime.status   && <span>🔵 {anime.status}</span>}
            {anime.season   && <span>🗓️ {anime.season} {anime.year}</span>}
            {anime.studios?.[0] && <span>🏢 {anime.studios[0].name}</span>}
            {anime.duration && <span>⏱️ {anime.duration}</span>}
            </div>
        </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatBox label="Episodios"  value={anime.episodes} />
        <StatBox label="Score"      value={anime.score} />
        <StatBox label="Rank"       value={anime.rank ? `#${anime.rank}` : null} />
        <StatBox label="Popularidad" value={anime.popularity ? `#${anime.popularity}` : null} />
        </div>

        {/* Sinopsis */}
        <section className="mb-10">
        <h2 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-3">
            <div className="w-1 h-6 bg-neon-cyan rounded-full" />
            Sinopsis
        </h2>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            {anime.synopsis ?? 'Sin sinopsis disponible.'}
        </p>
        </section>

        {/* Tráiler */}
        <TrailerSection trailer={anime.trailer} />

        {/* Personajes */}
        <section>
        <h2 className="font-orbitron font-bold text-xl text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-neon-purple rounded-full" />
            Personajes
        </h2>
        <CharactersSection animeId={id} />
        </section>

        {/* Reseñas */}
<ReviewSection
animeId={Number(id)}
animeTitle={anime.title}
/>

    </div>
    </div>
)
}


export default AnimeDetalle