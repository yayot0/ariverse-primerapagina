import { useEffect, useState } from 'react'
import { getAnimeStreaming } from '../../services/jikanApi'

// Colores y logos de cada plataforma
const PLATFORM_STYLES = {
'Crunchyroll': {
    color: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    emoji: '🟠'
},
'Netflix': {
    color: 'border-red-500/30 bg-red-500/10 text-red-400',
    emoji: '🔴'
},
'Amazon Prime Video': {
    color: 'border-blue-400/30 bg-blue-400/10 text-blue-400',
    emoji: '🔵'
},
'Funimation': {
    color: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    emoji: '🟣'
},
'Disney+': {
    color: 'border-blue-600/30 bg-blue-600/10 text-blue-300',
    emoji: '🏰'
},
'HIDIVE': {
    color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    emoji: '🌊'
},
'Hulu': {
    color: 'border-green-500/30 bg-green-500/10 text-green-400',
    emoji: '🟢'
},
'default': {
    color: 'border-gray-500/30 bg-gray-500/10 text-gray-400',
    emoji: '📺'
}
}

function PlatformBadge({ platform }) {
const style = PLATFORM_STYLES[platform.name] || PLATFORM_STYLES['default']

return (
    <a // <--- ESTA ETIQUETA ES LA QUE FALTA
    href={platform.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 px-4 py-2 rounded-xl border
                text-sm font-medium transition-all duration-300
                hover:scale-105 hover:brightness-125
                ${style.color}`}
    >
    <span>{style.emoji}</span>
    <span>{platform.name}</span>
    <span className="text-xs opacity-50">↗</span>
    </a>
)
}

function StreamingSection({ animeId, anime }) {
const [streaming, setStreaming] = useState([])
const [loading, setLoading]     = useState(true)

useEffect(() => {
    getAnimeStreaming(animeId)
    .then(data => setStreaming(data || []))
    .catch(() => setStreaming([]))
    .finally(() => setLoading(false))
}, [animeId])

  // Información de idiomas desde los datos del anime
const idiomas = []
if (anime?.title_japanese) idiomas.push({ lang: '🇯🇵', label: 'Japonés (Original)' })
if (anime?.title_english)  idiomas.push({ lang: '🇺🇸', label: 'Inglés (Sub/Dub)' })
idiomas.push({ lang: '🇲🇽', label: 'Español Latino (Sub)' })

const hasContent = streaming.length > 0 || idiomas.length > 0

if (!loading && !hasContent) return null

return (
    <section className="mb-10">

      {/* Plataformas de streaming */}
    <div className="mb-8">
        <h2 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-3">
        <div className="w-1 h-6 bg-neon-cyan rounded-full" />
        Disponible en
        </h2>

        {loading ? (
        <div className="flex flex-wrap gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-32 bg-dark-card rounded-xl animate-pulse" />
            ))}
        </div>
        ) : streaming.length > 0 ? (
        <div className="flex flex-wrap gap-3">
            {streaming.map((platform, i) => (
            <PlatformBadge key={i} platform={platform} />
            ))}
        </div>
        ) : (
        <p className="text-gray-600 text-sm">
            No hay información de streaming disponible para este anime.
        </p>
        )}
    </div>

      {/* Idiomas disponibles */}
    <div className="mb-8">
        <h2 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-3">
        <div className="w-1 h-6 bg-neon-purple rounded-full" />
        Idiomas Disponibles
        </h2>
        <div className="flex flex-wrap gap-3">
        {idiomas.map((idioma, i) => (
            <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border
                        border-neon-purple/30 bg-neon-purple/10 text-gray-300 text-sm"
            >
            <span>{idioma.lang}</span>
            <span>{idioma.label}</span>
            </div>
        ))}
        </div>
    </div>

      {/* Info adicional */}
    <div>
        <h2 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-3">
        <div className="w-1 h-6 bg-neon-pink rounded-full" />
        Información Adicional
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        {anime?.rating && (
            <div className="glass rounded-xl p-3 border border-dark-border">
            <p className="text-gray-500 text-xs mb-1">Clasificación</p>
            <p className="text-white text-sm font-medium">{anime.rating}</p>
            </div>
        )}

        {anime?.source && (
            <div className="glass rounded-xl p-3 border border-dark-border">
            <p className="text-gray-500 text-xs mb-1">Fuente</p>
            <p className="text-white text-sm font-medium">{anime.source}</p>
            </div>
        )}

        {anime?.demographics?.[0] && (
            <div className="glass rounded-xl p-3 border border-dark-border">
            <p className="text-gray-500 text-xs mb-1">Demografía</p>
            <p className="text-white text-sm font-medium">
                {anime.demographics[0].name}
            </p>
            </div>
        )}

        {anime?.aired?.string && (
            <div className="glass rounded-xl p-3 border border-dark-border">
            <p className="text-gray-500 text-xs mb-1">Emisión</p>
            <p className="text-white text-sm font-medium">{anime.aired.string}</p>
            </div>
        )}

        {anime?.licensors?.[0] && (
            <div className="glass rounded-xl p-3 border border-dark-border">
            <p className="text-gray-500 text-xs mb-1">Licenciado por</p>
            <p className="text-white text-sm font-medium">
                {anime.licensors[0].name}
            </p>
            </div>
        )}

        {anime?.producers?.[0] && (
            <div className="glass rounded-xl p-3 border border-dark-border">
            <p className="text-gray-500 text-xs mb-1">Productor</p>
            <p className="text-white text-sm font-medium">
                {anime.producers[0].name}
            </p>
            </div>
        )}

        </div>
    </div>
    </section>
)
}

export default StreamingSection