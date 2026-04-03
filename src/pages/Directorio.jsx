import { useCallback, useEffect, useState } from 'react'
import AnimeCard from '../components/ui/AnimeCard'
import FilterBar from '../components/ui/FilterBar'
import LoadingGrid from '../components/ui/LoadingGrid'
import Pagination from '../components/ui/Pagination'
import SearchBar from '../components/ui/SearchBar'
import SEO from '../components/ui/SEO'
import { searchAnimeWithFilters } from '../services/jikanApi'

function Directorio() {
  // Estados de la página
const [animes, setAnimes]           = useState([])
const [loading, setLoading]         = useState(true)
const [error, setError]             = useState(null)
const [query, setQuery]             = useState('')
const [selectedType, setSelectedType] = useState('')
const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages]   = useState(1)

  // Función principal de búsqueda
  // useCallback evita que esta función se recree en cada render
const fetchAnimes = useCallback(async () => {
    try {
    setLoading(true)
    setError(null)

    const result = await searchAnimeWithFilters({
        query,
        type: selectedType,
        page: currentPage,
    })

    setAnimes(result.data)
    setTotalPages(result.pagination?.last_visible_page || 1)
    } catch (err) {
    setError(err.message)
    } finally {
    setLoading(false)
    }
}, [query, selectedType, currentPage])

  // Se ejecuta cada vez que cambia query, tipo o página
useEffect(() => {
    // Pequeño delay para no spamear la API mientras el usuario escribe
    const timer = setTimeout(() => {
    fetchAnimes()
    }, 500)

    return () => clearTimeout(timer)
}, [fetchAnimes])

  // Cuando cambia la búsqueda o filtro, volver a página 1
const handleSearch = (newQuery) => {
    setQuery(newQuery)
    setCurrentPage(1)
}

const handleTypeChange = (type) => {
    setSelectedType(type)
    setCurrentPage(1)
}

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <SEO
        title="Directorio de Anime | AriVerse"
        description="Explora más de 30,000 animes. Busca por nombre, filtra por tipo y descubre tu próximo favorito en nuestro catálogo completo."
        url="https://ariverse-primerapagina.vercel.app/directorio"
    />

      {/* Header */}
    <div className="text-center mb-10">
        <h1 className="font-orbitron font-bold text-4xl text-white mb-3">
        Directorio de <span className="text-neon-purple glow-purple">Anime</span>
        </h1>
        <p className="text-gray-500">
        Explora más de 30,000 animes. Busca por nombre o filtra por tipo.
        </p>
    </div>

      {/* Búsqueda */}
    <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Buscar anime por nombre..." />
    </div>

      {/* Filtros */}
    <div className="mb-8">
        <FilterBar selectedType={selectedType} onTypeChange={handleTypeChange} />
    </div>

      {/* Resultado de búsqueda */}
    {query && !loading && (
        <p className="text-gray-500 text-sm mb-6 text-center">
        Resultados para: <span className="text-neon-cyan">"{query}"</span>
        </p>
    )}

      {/* Error */}
    {error && (
        <div className="text-center py-12">
        <p className="text-red-400 mb-2">Error al cargar los animes</p>
        <p className="text-gray-600 text-sm">{error}</p>
        <button
            onClick={fetchAnimes}
            className="mt-4 px-6 py-2 rounded-lg border border-neon-purple 
                    text-neon-purple hover:bg-neon-purple hover:text-white transition-all"
        >
            Reintentar
        </button>
        </div>
    )}

      {/* Grid */}
    {loading && <LoadingGrid count={20} />}

    {!loading && !error && animes.length === 0 && (
        <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-gray-400 font-medium">No se encontraron resultados</p>
        <p className="text-gray-600 text-sm mt-2">Intenta con otro nombre o filtro</p>
        </div>
    )}

    {!loading && !error && animes.length > 0 && (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animes.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
        </div>

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
        </>
    )}

    </div>
)
}

export default Directorio