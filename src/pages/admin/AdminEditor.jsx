import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    actualizarNoticia,
    crearNoticia,
    generarSlug,
    getNoticiasAdmin
} from '../../services/noticiasService'
import { useAuthStore } from '../../store/authStore'

const ADMIN_EMAIL  = 'yahirp827@gmail.com'
const CATEGORIAS   = ['Noticias', 'Rankings', 'Guías', 'Industria', 'Análisis']

function AdminEditor() {
const { user }     = useAuthStore()
const navigate     = useNavigate()
const { id }       = useParams()
const isEditing    = Boolean(id)

const [form, setForm] = useState({
    titulo:    '',
    resumen:   '',
    contenido: '',
    imagen:    '',
    categoria: 'Noticias',
    autor:     'Yahir',
    published: true,
    slug:      '',
})
const [loading, setLoading]   = useState(false)
const [saving, setSaving]     = useState(false)
const [error, setError]       = useState(null)
const [preview, setPreview]   = useState(false)

  // Proteger ruta
useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); return }

    // Si es edición cargar datos existentes
    if (isEditing) {
    setLoading(true)
    getNoticiasAdmin()
        .then(data => {
        const noticia = data.find(n => n.id === Number(id))
        if (noticia) setForm(noticia)
        else navigate('/admin/noticias')
        })
        .finally(() => setLoading(false))
    }
}, [user, id])

const handleChange = (field, value) => {
    setForm(prev => {
    const updated = { ...prev, [field]: value }
      // Auto-generar slug cuando cambia el título (solo en creación)
    if (field === 'titulo' && !isEditing) {
        updated.slug = generarSlug(value)
    }
    return updated
    })
}

const handleSave = async () => {
    // Validaciones
    if (!form.titulo.trim())    { setError('El título es requerido'); return }
    if (!form.resumen.trim())   { setError('El resumen es requerido'); return }
    if (!form.contenido.trim()) { setError('El contenido es requerido'); return }
    if (!form.imagen.trim())    { setError('La imagen es requerida'); return }
    if (!form.slug.trim())      { setError('El slug es requerido'); return }

    try {
    setSaving(true)
    setError(null)

    if (isEditing) {
        await actualizarNoticia(Number(id), form)
    } else {
        await crearNoticia(form)
    }

    navigate('/admin/noticias')
    } catch (err) {
    setError(err.message)
    } finally {
    setSaving(false)
    }
}

if (!user || user.email !== ADMIN_EMAIL) return null

if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
    <div className="h-10 bg-dark-card rounded w-1/3 mb-8" />
    <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 bg-dark-card rounded-xl" />
        ))}
    </div>
    </div>
)

return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
        <Link
            to="/admin/noticias"
            className="text-gray-500 hover:text-white transition-colors"
        >
            ← Volver
        </Link>
        <h1 className="font-orbitron font-bold text-2xl text-white">
            {isEditing ? 'Editar Noticia' : 'Nueva Noticia'}
        </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle preview */}
        <button
            onClick={() => setPreview(!preview)}
            className={`px-4 py-2 rounded-lg text-sm transition-all border
            ${preview
                ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10'
                : 'border-dark-border text-gray-400 hover:border-neon-cyan'
            }`}
        >
            {preview ? '✏️ Editar' : '👁️ Preview'}
        </button>

          {/* Guardar */}
        <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                    text-white font-medium transition-all hover:shadow-neon-purple
                    disabled:opacity-50"
        >
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Publicar'}
        </button>
        </div>
    </div>

    {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
        <p className="text-red-400 text-sm">{error}</p>
        </div>
    )}

      {/* Preview mode */}
    {preview ? (
        <div className="glass rounded-2xl p-8 border border-dark-border">
        <span className="text-xs px-3 py-1 rounded-full border text-neon-cyan
                        bg-neon-cyan/10 border-neon-cyan/30">
            {form.categoria}
        </span>
        <h1 className="font-orbitron font-bold text-2xl text-white mt-4 mb-4">
            {form.titulo || 'Título del artículo'}
        </h1>
        {form.imagen && (
            <div className="aspect-video rounded-xl overflow-hidden mb-6">
            <img src={form.imagen} alt="" className="w-full h-full object-cover" />
            </div>
        )}
        {form.contenido.split('\n\n').map((p, i) => (
            <p key={i} className="text-gray-300 leading-relaxed mb-4 text-sm">
            {p}
            </p>
        ))}
        </div>
    ) : (
        /* Editor mode */
        <div className="flex flex-col gap-5">

          {/* Título */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">
            Título <span className="text-red-400">*</span>
            </label>
            <input
            type="text"
            value={form.titulo}
            onChange={e => handleChange('titulo', e.target.value)}
            placeholder="Título del artículo"
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white placeholder-gray-600 text-sm
                        focus:outline-none focus:border-neon-purple transition-all"
            />
        </div>

          {/* Slug */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">
            Slug (URL) <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2 bg-dark-bg border border-dark-border
                            rounded-xl px-4 py-3">
            <span className="text-gray-600 text-sm">/noticias/</span>
            <input
                type="text"
                value={form.slug}
                onChange={e => handleChange('slug', e.target.value)}
                placeholder="mi-articulo"
                className="flex-1 bg-transparent text-white text-sm
                    focus:outline-none placeholder-gray-600"
            />
            </div>
        </div>

          {/* Resumen */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">
            Resumen <span className="text-red-400">*</span>
            </label>
            <textarea
            value={form.resumen}
            onChange={e => handleChange('resumen', e.target.value)}
            placeholder="Resumen corto del artículo (aparece en la card)"
            rows={3}
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white placeholder-gray-600 text-sm resize-none
                        focus:outline-none focus:border-neon-purple transition-all"
            />
        </div>

          {/* Imagen */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">
            URL de imagen <span className="text-red-400">*</span>
            </label>
            <input
            type="url"
            value={form.imagen}
            onChange={e => handleChange('imagen', e.target.value)}
            placeholder="https://..."
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white placeholder-gray-600 text-sm
                        focus:outline-none focus:border-neon-purple transition-all"
            />
            {form.imagen && (
            <div className="mt-2 aspect-video rounded-lg overflow-hidden max-w-xs">
                <img src={form.imagen} alt="" className="w-full h-full object-cover" />
            </div>
            )}
        </div>

          {/* Categoría y publicado */}
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="text-gray-400 text-sm mb-1 block">Categoría</label>
            <select
                value={form.categoria}
                onChange={e => handleChange('categoria', e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white text-sm focus:outline-none focus:border-neon-purple
                        transition-all"
            >
                {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="text-gray-400 text-sm mb-1 block">Estado</label>
            <select
                value={form.published ? 'true' : 'false'}
                onChange={e => handleChange('published', e.target.value === 'true')}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white text-sm focus:outline-none focus:border-neon-purple
                        transition-all"
            >
                <option value="true">✅ Publicado</option>
                <option value="false">📝 Borrador</option>
            </select>
            </div>
        </div>

          {/* Contenido */}
        <div>
            <label className="text-gray-400 text-sm mb-1 block">
            Contenido <span className="text-red-400">*</span>
            </label>
            <p className="text-gray-600 text-xs mb-2">
            Separa los párrafos con una línea en blanco
            </p>
            <textarea
            value={form.contenido}
            onChange={e => handleChange('contenido', e.target.value)}
            placeholder="Escribe el contenido del artículo aquí...

Segundo párrafo..."
            rows={16}
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                        text-white placeholder-gray-600 text-sm
                        focus:outline-none focus:border-neon-purple transition-all
                        font-mono leading-relaxed"
            />
            <p className="text-gray-600 text-xs mt-1 text-right">
            {form.contenido.length} caracteres
            </p>
        </div>

        </div>
    )}
    </div>
)
}

export default AdminEditor