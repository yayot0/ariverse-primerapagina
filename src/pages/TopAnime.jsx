import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingGrid from '../components/ui/LoadingGrid'
import Pagination from '../components/ui/Pagination'
import { searchAnimeWithFilters } from '../services/jikanApi'

// ─── Medalla según posición ───────────────────────────────────────────────────
function Medal({ rank }) {
if (rank === 1) return <span className="text-2xl">🥇</span>
if (rank === 2) return <span className="text-2xl">🥈</span>
if (rank === 3) return <span className="text-2xl">🥉</span>
return (
    <span className="font-orbitron font-bold text-gray-500 text-sm w-8 text-center">
    #{rank}
    </span>
)
}

// ─── Card destacada para top 3 ────────────────────────────────────────────────
function TopCard({ anime, rank }) {
const borderColors = {
    1: 'border-yellow-400 shadow-yellow-400/30',
    2: 'border-gray-300 shadow-gray-300/30',
    3: 'border-orange-400 shadow-orange-400/30',
}

return (
    <Link
    to={`/anime/${anime.mal_id}`}
    className={`group relative bg-dark-card border-2 rounded-xl overflow-hidden 
                hover:-translate-y-2 transition-all duration-300 shadow-lg
                ${borderColors[rank]}`}
    >
      {/* Número de posición */}
    <div className="absolute top-3 left-3 z-10 bg-dark-bg/80 backdrop-blur-sm 
                    rounded-lg px-2 py-1">
        <Medal rank={rank} />
    </div>

      {/* Score */}
    <div className="absolute top-3 right-3 z-10 bg-dark-bg/80 backdrop-blur-sm 
                    border border-neon-cyan rounded-lg px-2 py-1">
        <span className="text-neon-cyan text-xs font-bold">⭐ {anime.score}</span>
    </div>

      {/* Imagen */}
    <div className="aspect-[3/4] overflow-hidden">
        <img
        src={anime.images?.jpg?.large_image_url}
        alt={anime.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
    </div>

      {/* Info */}
    <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-2 
                    group-hover:text-neon-cyan transition-colors">
        {anime.title}
        </h3>
    <div className="flex flex-wrap gap-1 mt-1">
        {anime.genres?.slice(0, 2).map(g => (
            <span key={g.mal_id}
            className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/30 text-neon-purple">
            {g.name}
            </span>
        ))}
        </div>
    </div>
    </Link>
)
}

// ─── Fila de la tabla para el resto ──────────────────────────────────────────
function RankRow({ anime, rank }) {
return (
    <Link
    to={`/anime/${anime.mal_id}`}
    className="flex items-center gap-4 p-3 rounded-xl bg-dark-card border border-dark-border
                hover:border-neon-purple hover:bg-neon-purple/5 transition-all duration-300 group"
    >
      {/* Rank */}
    <div className="w-10 text-center flex-shrink-0">
        <Medal rank={rank} />
    </div>

      {/* Poster pequeño */}
    <img
        src={anime.images?.jpg?.image_url}
        alt={anime.title}
        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
    />

      {/* Info */}
    <div className="flex-1 min-w-0">
        <h3 className="text-white text-sm font-medium line-clamp-1 
                    group-hover:text-neon-cyan transition-colors">
        {anime.title}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
        {anime.type     && <span>{anime.type}</span>}
        {anime.episodes && <span>{anime.episodes} eps</span>}
        {anime.year     && <span>{anime.year}</span>}
        </div>
    </div>

      {/* Géneros */}
    <div className="hidden sm:flex flex-wrap gap-1 max-w-32">
        {anime.genres?.slice(0, 2).map(g => (
        <span key={g.mal_id}
            className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple">
            {g.name}
        </span>
        ))}
    </div>

      {/* Score */}
    <div className="flex-shrink-0 text-right">
        <p className="text-neon-cyan font-bold font-orbitron">⭐ {anime.score}</p>
        {anime.members && (
        <p className="text-gray-600 text-xs">
            {(anime.members / 1000).toFixed(0)}K miembros
        </p>
        )}
    </div>
    </Link>
)
}

// ─── Página principal ─────────────────────────────────────────────────────────
function TopAnime() {
const [animes, setAnimes]           = useState([])
const [loading, setLoading]         = useState(true)
const [error, setError]             = useState(null)
const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages]   = useState(1)

useEffect(() => {
    window.scrollTo(0, 0)

    const fetchTop = async () => {
    try {
        setLoading(true)
        setError(null)
        const result = await searchAnimeWithFilters({
        query: '',
        type: '',
        page: currentPage,
        })
        setAnimes(result.data)
        setTotalPages(result.pagination?.last_visible_page || 1)
    } catch (err) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
    }

    fetchTop()
}, [currentPage])

  // Los primeros 3 son los destacados, el resto va en la tabla
const topThree  = animes.slice(0, 3)
const restAnime = animes.slice(3)
  const rankOffset = (currentPage - 1) * 20

return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
    <div className="text-center mb-10">
        <h1 className="font-orbitron font-bold text-4xl text-white mb-3">
        Top <span className="text-neon-cyan glow-cyan">Anime</span>
        </h1>
        <p className="text-gray-500">
        Los animes mejor calificados según MyAnimeList
        </p>
    </div>

      {/* Error */}
    {error && (
        <div className="text-center py-12">
        <p className="text-red-400 mb-2">{error}</p>
        <button
            onClick={() => setCurrentPage(p => p)}
            className="mt-4 px-6 py-2 rounded-lg border border-neon-purple 
                    text-neon-purple hover:bg-neon-purple hover:text-white transition-all"
        >
            Reintentar
        </button>
        </div>
    )}

      {/* Loading */}
    {loading && <LoadingGrid count={20} />}

      {/* Contenido */}
    {!loading && !error && (
        <>
          {/* Top 3 destacados — solo en página 1 */}
        {currentPage === 1 && topThree.length > 0 && (
            <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-yellow-400 rounded-full" />
                <h2 className="font-orbitron font-bold text-xl text-white">
                Podio
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {topThree.map((anime, i) => (
                <TopCard key={anime.mal_id} anime={anime} rank={i + 1} />
                ))}
            </div>
            </section>
        )}

          {/* Lista completa */}
        <section>
            <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-neon-cyan rounded-full" />
            <h2 className="font-orbitron font-bold text-xl text-white">
                {currentPage === 1 ? 'Ranking Completo' : `Página ${currentPage}`}
            </h2>
            </div>

            <div className="flex flex-col gap-2">
            {(currentPage === 1 ? restAnime : animes).map((anime, i) => (
                <RankRow
                key={anime.mal_id}
                anime={anime}
                rank={rankOffset + (currentPage === 1 ? i + 4 : i + 1)}
                />
            ))}
            </div>
        </section>

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
            setCurrentPage(page)
            window.scrollTo(0, 0)
            }}
        />
        </>
    )}
    </div>
)
}

export default TopAnime