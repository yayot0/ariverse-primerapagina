import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import SEO from '../components/ui/SEO'
import { getSeasonByYear } from '../services/jikanApi'

const TEMPORADAS = ['winter', 'spring', 'summer', 'fall']
const TEMPORADA_LABELS = {
winter: '❄️ Invierno',
spring: '🌸 Primavera',
summer: '☀️ Verano',
fall:   '🍂 Otoño',
}

// Detectar temporada actual
const getCurrentSeason = () => {
const month = new Date().getMonth() + 1
if (month <= 3)  return 'winter'
if (month <= 6)  return 'spring'
if (month <= 9)  return 'summer'
return 'fall'
}

const getCurrentYear = () => new Date().getFullYear()

// ─── Card de estreno ──────────────────────────────────────────────────────────
function EstrenoCard({ anime }) {
return (
    <Link
    to={`/anime/${anime.mal_id}`}
    className="group flex gap-3 p-3 bg-dark-card border border-dark-border rounded-xl
                hover:border-neon-purple hover:bg-neon-purple/5 transition-all duration-300"
    >
      {/* Poster */}
    <img
        src={anime.images?.jpg?.image_url}
        alt={anime.title}
        className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
    />

      {/* Info */}
    <div className="flex-1 min-w-0">
        <h3 className="text-white text-sm font-medium line-clamp-2 
                    group-hover:text-neon-purple transition-colors">
        {anime.title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
        {anime.episodes && <span>📺 {anime.episodes} eps</span>}
        {anime.studios?.[0] && <span>🏢 {anime.studios[0].name}</span>}
        </div>
        {anime.score && (
        <span className="text-neon-cyan text-xs font-bold mt-1 block">
            ⭐ {anime.score}
        </span>
        )}
    </div>

      {/* Géneros */}
    <div className="hidden sm:flex flex-col gap-1 flex-shrink-0">
        {anime.genres?.slice(0, 2).map(g => (
        <span key={g.mal_id}
            className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple">
            {g.name}
        </span>
        ))}
    </div>
    </Link>
)
}

// ─── Página principal ─────────────────────────────────────────────────────────
function Calendario() {
const [temporada, setTemporada] = useState(getCurrentSeason())
const [year, setYear]           = useState(getCurrentYear())
const [animes, setAnimes]       = useState([])
const [loading, setLoading]     = useState(true)
const [error, setError]         = useState(null)

useEffect(() => {
    window.scrollTo(0, 0)

    const fetchCalendario = async () => {
    try {
        setLoading(true)
        setError(null)
        
        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Usamos nuestra función del servicio en lugar del fetch manual
        const result = await getSeasonByYear(year, temporada)
        
        // Ordenamos por calificación (score) de mayor a menor
        const sorted = result.sort((a, b) => (b.score || 0) - (a.score || 0))
        
        setAnimes(sorted)
        // ---------------------------
        
    } catch (err) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
    }

    fetchCalendario()
}, [temporada, year])

  // Años disponibles
const years = Array.from({ length: 6 }, (_, i) => getCurrentYear() - i)

return (
    <PageTransition>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <SEO
title="Calendario de Estrenos"
description="Calendario de estrenos de anime por temporada. Conoce qué animes se estrenan cada temporada."
url="https://ariverse-primerapagina.vercel.app/calendario"
/>

      {/* Header */}
    <div className="text-center mb-10">
        <h1 className="font-orbitron font-bold text-4xl text-white mb-3">
        Calendario de <span className="text-neon-purple glow-purple">Estrenos</span>
        </h1>
        <p className="text-gray-500">
        Animes por temporada y año
        </p>
    </div>

      {/* Selector de año */}
    <div className="flex flex-wrap gap-2 justify-center mb-4">
        {years.map(y => (
        <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${year === y
                ? 'bg-neon-purple text-white shadow-neon-purple'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-purple hover:text-white'
            }`}
        >
            {y}
        </button>
        ))}
    </div>

      {/* Selector de temporada */}
    <div className="flex flex-wrap gap-2 justify-center mb-10">
        {TEMPORADAS.map(t => (
        <button
            key={t}
            onClick={() => setTemporada(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
            ${temporada === t
                ? 'bg-neon-cyan text-dark-bg font-bold'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-cyan hover:text-white'
            }`}
        >
            {TEMPORADA_LABELS[t]}
        </button>
        ))}
    </div>

      {/* Título de sección */}
    <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-neon-purple rounded-full" />
        <h2 className="font-orbitron font-bold text-xl text-white">
        {TEMPORADA_LABELS[temporada]} {year}
        </h2>
        {!loading && (
        <span className="text-gray-600 text-sm">
            ({animes.length} animes)
        </span>
        )}
    </div>

      {/* Error */}
    {error && (
        <div className="text-center py-12">
        <p className="text-red-400 mb-2">Error al cargar el calendario</p>
        <p className="text-gray-600 text-sm">{error}</p>
        </div>
    )}

      {/* Loading */}
    {loading && (
        <div className="flex flex-col gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-20 bg-dark-card rounded-xl animate-pulse" />
        ))}
        </div>
    )}

      {/* Lista de estrenos */}
    {!loading && !error && (
        <div className="flex flex-col gap-3">
        {animes.length === 0 ? (
            <div className="text-center py-20">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-400">No hay información para esta temporada</p>
            </div>
        ) : (
            animes.map(anime => (
            <EstrenoCard key={anime.mal_id} anime={anime} />
            ))
        )}
        </div>
    )}
    </div>
    </PageTransition>
)
}

export default Calendario