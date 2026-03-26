import { Link } from 'react-router-dom'

function AnimeCard({ anime }) {
  // Acortar sinopsis larga
const shortSynopsis = anime.synopsis
    ? anime.synopsis.substring(0, 120) + '...'
    : 'Sin descripción disponible.'

return (
    <Link
    to={`/anime/${anime.mal_id}`}
    className="group block bg-dark-card border border-dark-border rounded-xl 
                overflow-hidden hover:border-neon-purple transition-all duration-300 
                hover:shadow-neon-purple hover:-translate-y-1"
    >
      {/* Imagen */}
    <div className="relative overflow-hidden aspect-[3/4]">
        <img
        src={anime.images?.jpg?.large_image_url}
        alt={anime.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        />
        {/* Score badge */}
        {anime.score && (
        <div className="absolute top-2 right-2 bg-dark-bg/80 backdrop-blur-sm 
                        border border-neon-cyan rounded-lg px-2 py-1">
            <span className="text-neon-cyan text-xs font-bold">⭐ {anime.score}</span>
        </div>
        )}
        {/* Episodios badge */}
        {anime.episodes && (
        <div className="absolute bottom-2 left-2 bg-dark-bg/80 backdrop-blur-sm 
                        border border-dark-border rounded-lg px-2 py-1">
            <span className="text-gray-300 text-xs">{anime.episodes} eps</span>
        </div>
        )}
    </div>

      {/* Info */}
    <div className="p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1 
                    group-hover:text-neon-cyan transition-colors">
        {anime.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
        {shortSynopsis}
        </p>

        {/* Géneros */}
        {anime.genres && anime.genres.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 2).map((genre) => (
            <span
                key={genre.mal_id}
                className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/20 
                        text-neon-purple border border-neon-purple/30"
            >
                {genre.name}
            </span>
            ))}
        </div>
        )}
    </div>
    </Link>
)
}

export default AnimeCard