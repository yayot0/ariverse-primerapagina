import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categorias, noticias } from '../data/noticias'

// ─── Card de noticia ──────────────────────────────────────────────────────────
function NoticiaCard({ noticia }) {
const fecha = new Date(noticia.fecha).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
})

const categoryColors = {
    'Noticias':  'text-neon-cyan   bg-neon-cyan/10   border-neon-cyan/30',
    'Rankings':  'text-neon-pink   bg-neon-pink/10   border-neon-pink/30',
    'Guías':     'text-neon-purple bg-neon-purple/10 border-neon-purple/30',
    'Industria': 'text-yellow-400  bg-yellow-400/10  border-yellow-400/30',
    'Análisis':  'text-green-400   bg-green-400/10   border-green-400/30',
}

return (
    <Link
    to={`/noticias/${noticia.slug}`}
    className="group block bg-dark-card border border-dark-border rounded-xl 
                overflow-hidden hover:border-neon-cyan hover:-translate-y-1 
                transition-all duration-300 hover:shadow-neon-cyan"
    >
      {/* Imagen */}
    <div className="aspect-video overflow-hidden">
        <img
        src={noticia.imagen}
        alt={noticia.titulo}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        />
    </div>

      {/* Contenido */}
    <div className="p-4">
        {/* Categoría y fecha */}
        <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-3 py-1 rounded-full border ${categoryColors[noticia.categoria] || categoryColors['Noticias']}`}>
            {noticia.categoria}
        </span>
        <span className="text-gray-600 text-xs">{fecha}</span>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-white text-base line-clamp-2 mb-2 
                    group-hover:text-neon-cyan transition-colors leading-snug">
        {noticia.titulo}
        </h3>

        {/* Resumen */}
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
        {noticia.resumen}
        </p>

        {/* Autor */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dark-border">
        <div className="w-6 h-6 rounded-full bg-neon-purple/30 flex items-center justify-center">
            <span className="text-xs text-neon-purple font-bold">
            {noticia.autor[0]}
            </span>
        </div>
        <span className="text-gray-600 text-xs">{noticia.autor}</span>
        </div>
    </div>
    </Link>
)
}

// ─── Página principal ─────────────────────────────────────────────────────────
function Noticias() {
const [categoriaActiva, setCategoriaActiva] = useState('Todos')

const noticiasFiltradas = categoriaActiva === 'Todos'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaActiva)

return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
    <div className="text-center mb-10">
        <h1 className="font-orbitron font-bold text-4xl text-white mb-3">
        Noticias <span className="text-neon-cyan glow-cyan">Anime</span>
        </h1>
        <p className="text-gray-500">
        Mantente al día con lo último del mundo del anime
        </p>
    </div>

      {/* Filtro por categoría */}
    <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categorias.map(cat => (
        <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
              ${categoriaActiva === cat
                ? 'bg-neon-cyan text-dark-bg font-bold'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-cyan hover:text-white'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de noticias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticiasFiltradas.map(noticia => (
          <NoticiaCard key={noticia.id} noticia={noticia} />
        ))}
      </div>

      {noticiasFiltradas.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📰</p>
          <p className="text-gray-400">No hay noticias en esta categoría</p>
        </div>
      )}
    </div>
  )
}

export default Noticias