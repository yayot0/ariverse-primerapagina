import { Link, useParams } from 'react-router-dom'
import SEO from '../components/ui/SEO'
import { noticias } from '../data/noticias'

function NoticiaDetalle() {
const { slug } = useParams()
const noticia = noticias.find(n => n.slug === slug)

  // Si no existe el artículo
if (!noticia) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <p className="text-4xl">📰</p>
    <p className="text-gray-400 text-lg">Artículo no encontrado</p>
    <Link to="/noticias"
        className="px-6 py-2 rounded-lg border border-neon-cyan text-neon-cyan 
                hover:bg-neon-cyan hover:text-dark-bg transition-all">
        ← Volver a Noticias
    </Link>
    </div>
)

const fecha = new Date(noticia.fecha).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
})

return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        <SEO
title={noticia.titulo}
description={noticia.resumen}
image={noticia.imagen}
url={`https://ariverse-primerapagina.vercel.app/noticias/${noticia.slug}`}
type="article"
/>

      {/* Volver */}
    <Link to="/noticias"
        className="text-gray-600 text-sm hover:text-neon-cyan transition-colors mb-6 block">
        ← Volver a Noticias
    </Link>

      {/* Categoría y fecha */}
    <div className="flex items-center gap-3 mb-4">
        <span className="text-xs px-3 py-1 rounded-full border 
                        text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30">
        {noticia.categoria}
        </span>
        <span className="text-gray-600 text-sm">{fecha}</span>
    </div>

      {/* Título */}
    <h1 className="font-orbitron font-bold text-2xl md:text-3xl text-white 
                    leading-tight mb-6">
        {noticia.titulo}
    </h1>

      {/* Autor */}
    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-border">
        <div className="w-10 h-10 rounded-full bg-neon-purple/30 flex items-center justify-center">
        <span className="text-neon-purple font-bold">{noticia.autor[0]}</span>
        </div>
        <div>
        <p className="text-white text-sm font-medium">{noticia.autor}</p>
        <p className="text-gray-600 text-xs">Autor</p>
        </div>
    </div>

      {/* Imagen */}
    <div className="aspect-video rounded-xl overflow-hidden mb-8 
                    border border-dark-border">
        <img
        src={noticia.imagen}
        alt={noticia.titulo}
        className="w-full h-full object-cover"
        />
    </div>

      {/* Contenido */}
    <div className="prose prose-invert max-w-none">
        {noticia.contenido.split('\n\n').map((parrafo, i) => (
        <p key={i} className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
            {parrafo}
        </p>
        ))}
    </div>

      {/* Separador */}
    <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-purple 
                    to-transparent my-10" />

      {/* Más noticias */}
    <div>
        <h2 className="font-orbitron font-bold text-lg text-white mb-4">
        Más Noticias
        </h2>
        <div className="flex flex-col gap-3">
        {noticias
            .filter(n => n.slug !== slug)
            .slice(0, 3)
            .map(n => (
            <Link
                key={n.id}
                to={`/noticias/${n.slug}`}
                className="flex gap-3 p-3 rounded-xl bg-dark-card border border-dark-border 
                        hover:border-neon-cyan transition-all group"
            >
                <img
                src={n.imagen}
                alt={n.titulo}
                className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                <p className="text-white text-sm font-medium line-clamp-2 
                                group-hover:text-neon-cyan transition-colors">
                    {n.titulo}
                </p>
                <p className="text-gray-600 text-xs mt-1">{n.categoria}</p>
                </div>
            </Link>
            ))}
        </div>
    </div>
    </div>
)
}

export default NoticiaDetalle