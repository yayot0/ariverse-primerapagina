import { Link } from 'react-router-dom'
import AnimeCard from '../components/ui/AnimeCard'
import LoadingGrid from '../components/ui/LoadingGrid'
import { useAnime } from '../hooks/useAnime'
import { getCurrentSeason, getTopAnime } from '../services/jikanApi'

// ─── Sección Hero ────────────────────────────────────────────────────────────
function HeroSection() {
return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Fondo con gradientes animados */}
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 
                        rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 
                        rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-pink/10 
                        rounded-full blur-3xl animate-pulse delay-500" />
    </div>

      {/* Grid de puntos de fondo */}
    <div
        className="absolute inset-0 opacity-20"
        style={{
        backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        }}
    />

      {/* Contenido principal */}
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                        border border-neon-cyan/30 bg-neon-cyan/10 mb-6">
        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
        <span className="text-neon-cyan text-sm font-medium">
            Tu portal de anime definitivo
        </span>
        </div>

        <h1 className="font-orbitron font-black text-5xl md:text-7xl mb-6 leading-tight">
        <span className="text-white">ARI</span>
        <span className="text-neon-cyan glow-cyan">VERSE</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
        Descubre, explora y organiza tu colección de anime. Noticias, rankings,
        calendario de estrenos y mucho más en un solo lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
            to="/directorio"
            className="px-8 py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80 
                    text-white font-semibold transition-all duration-300 
                    hover:shadow-neon-purple hover:scale-105"
        >
            Explorar Directorio
        </Link>
        <Link
            to="/top"
            className="px-8 py-3 rounded-xl border border-neon-cyan text-neon-cyan 
                    hover:bg-neon-cyan hover:text-dark-bg font-semibold 
                    transition-all duration-300 hover:scale-105"
        >
            Ver Top Anime
        </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-16">
        {[
            { value: '30K+', label: 'Animes' },
            { value: '1M+',  label: 'Usuarios' },
            { value: '500+', label: 'Noticias' },
        ].map((stat) => (
            <div key={stat.label} className="text-center">
            <p className="font-orbitron font-bold text-2xl text-neon-cyan glow-cyan">
                {stat.value}
            </p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
        ))}
        </div>
    </div>
    </section>
)
}

// ─── Sección de animes ────────────────────────────────────────────────────────
function AnimeSection({ title, fetchFn, linkTo }) {
const { data, loading, error } = useAnime(fetchFn)

return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header de sección */}
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-neon-cyan rounded-full" />
        <h2 className="font-orbitron font-bold text-2xl text-white">{title}</h2>
        </div>
        <Link
        to={linkTo}
        className="text-neon-cyan text-sm hover:underline transition-colors"
        >
        Ver todos →
        </Link>
    </div>

      {/* Contenido */}
    {error && (
        <div className="text-center py-12 text-red-400">
        <p>Error al cargar: {error}</p>
        <p className="text-gray-500 text-sm mt-2">Intenta recargar la página</p>
        </div>
    )}

    {loading && <LoadingGrid count={6} />}

    {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.slice(0, 6).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
        </div>
    )}
    </section>
)
}

// ─── Home principal ───────────────────────────────────────────────────────────
function Home() {
return (
    <div>
    <HeroSection />

      {/* Separador */}
    <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />

    <AnimeSection
        title="Top Anime"
        fetchFn={getTopAnime}
        linkTo="/top"
    />

    <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />

    <AnimeSection
        title="Temporada Actual"
        fetchFn={getCurrentSeason}
        linkTo="/directorio"
    />
    </div>
)
}

export default Home