import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    actualizarReview,
    crearReview,
    eliminarReview,
    getMiReview,
    getReviews
} from '../../services/reviewService'
import { useAuthStore } from '../../store/authStore'

// ─── Estrellas interactivas ───────────────────────────────────────────────────
function StarRating({ rating, onChange, readonly = false }) {
const [hover, setHover] = useState(0)

return (
    <div className="flex items-center gap-1">
    {Array.from({ length: 10 }).map((_, i) => {
        const value = i + 1
        return (
        <button
            key={value}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(value)}
            onMouseEnter={() => !readonly && setHover(value)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`text-xl transition-all duration-150 disabled:cursor-default
            ${value <= (hover || rating)
                ? 'text-yellow-400 scale-110'
                : 'text-gray-700'
            }`}
        >
            ★
        </button>
        )
    })}
    {rating > 0 && (
        <span className="text-neon-cyan font-orbitron font-bold text-sm ml-2">
        {rating}/10
        </span>
    )}
    </div>
)
}

// ─── Card de reseña ───────────────────────────────────────────────────────────
function ReviewCard({ review, currentUserId, onDelete }) {
const fecha = new Date(review.created_at).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
})

const isOwner = currentUserId === review.user_id
const username = review.profiles?.username || 'Usuario'

return (
    <div className="glass rounded-xl p-4 border border-dark-border">
      {/* Header */}
    <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-neon-purple/30 border border-neon-purple/50
                        flex items-center justify-center flex-shrink-0 overflow-hidden">
            {review.profiles?.avatar_url ? (
            <img
                src={review.profiles.avatar_url}
                alt={username}
                className="w-full h-full object-cover"
            />
            ) : (
            <span className="text-neon-purple font-bold text-sm">
                {username[0].toUpperCase()}
            </span>
            )}
        </div>

        <div>
            <p className="text-white text-sm font-medium">{username}</p>
            <p className="text-gray-600 text-xs">{fecha}</p>
        </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
        <span className="font-orbitron font-bold text-neon-cyan">
            ⭐ {review.rating}/10
        </span>
        {isOwner && (
            <button
            onClick={() => onDelete(review)}
            className="text-gray-600 hover:text-red-400 transition-colors text-sm ml-2"
            title="Eliminar reseña"
            >
            🗑️
            </button>
        )}
        </div>
    </div>

      {/* Contenido */}
    <p className="text-gray-400 text-sm leading-relaxed">{review.contenido}</p>
    </div>
)
}

// ─── Formulario de reseña ─────────────────────────────────────────────────────
function ReviewForm({ animeId, animeTitle, userId, miReview, onSave }) {
const [rating, setRating]       = useState(miReview?.rating || 0)
const [contenido, setContenido] = useState(miReview?.contenido || '')
const [loading, setLoading]     = useState(false)
const [error, setError]         = useState(null)

const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Selecciona una calificación'); return }
    if (!contenido.trim()) { setError('Escribe tu reseña'); return }

    try {
    setLoading(true)
    setError(null)
    let result

    if (miReview) {
        result = await actualizarReview({ userId, animeId, rating, contenido })
    } else {
        result = await crearReview({ userId, animeId, animeTitle, rating, contenido })
    }

    onSave(result)
    } catch {
    setError('Error al guardar la reseña')
    } finally {
    setLoading(false)
    }
}

return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-5 border border-neon-purple/30">
    <h3 className="font-semibold text-white mb-4">
        {miReview ? '✏️ Editar tu reseña' : '✍️ Escribe una reseña'}
    </h3>

      {/* Calificación */}
    <div className="mb-4">
        <label className="text-gray-400 text-sm mb-2 block">Calificación</label>
        <StarRating rating={rating} onChange={setRating} />
    </div>

      {/* Texto */}
    <div className="mb-4">
        <label className="text-gray-400 text-sm mb-2 block">Tu reseña</label>
        <textarea
        value={contenido}
        onChange={e => setContenido(e.target.value)}
        placeholder="¿Qué te pareció este anime? Comparte tu opinión..."
        rows={4}
        maxLength={500}
        className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                    text-white placeholder-gray-600 text-sm resize-none
                    focus:outline-none focus:border-neon-purple transition-all"
        />
        <p className="text-gray-600 text-xs mt-1 text-right">
        {contenido.length}/500
        </p>
    </div>

    {error && (
        <p className="text-red-400 text-sm mb-3">{error}</p>
    )}

    <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                text-white text-sm font-medium transition-all
                hover:shadow-neon-purple disabled:opacity-50"
    >
        {loading ? 'Guardando...' : miReview ? 'Actualizar Reseña' : 'Publicar Reseña'}
    </button>
    </form>
)
}

// ─── Sección principal ────────────────────────────────────────────────────────
function ReviewSection({ animeId, animeTitle }) {
const { user }                = useAuthStore()
const [reviews, setReviews]   = useState([])
const [miReview, setMiReview] = useState(null)
const [loading, setLoading]   = useState(true)

useEffect(() => {
    const fetchReviews = async () => {
    try {
        const data = await getReviews(animeId)
        setReviews(data)

        if (user) {
        const mine = await getMiReview(user.id, animeId)
        setMiReview(mine)
        }
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
    }

    fetchReviews()
}, [animeId, user])

const handleSave = (review) => {
    setMiReview(review)
    setReviews(prev => {
    const exists = prev.find(r => r.user_id === review.user_id)
    if (exists) return prev.map(r => r.user_id === review.user_id ? review : r)
    return [review, ...prev]
    })
}

const handleDelete = async (review) => {
    if (!confirm('¿Eliminar tu reseña?')) return
    try {
    await eliminarReview({ userId: user.id, animeId })
    setMiReview(null)
    setReviews(prev => prev.filter(r => r.id !== review.id))
    } catch {
    alert('Error al eliminar')
    }
}

  // Score promedio
const avgScore = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

return (
    <section className="mt-12">
      {/* Header */}
    <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron font-bold text-xl text-white flex items-center gap-3">
        <div className="w-1 h-6 bg-neon-cyan rounded-full" />
        Reseñas de la Comunidad
        </h2>
        {avgScore && (
        <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-yellow-400">⭐</span>
            <span className="font-orbitron font-bold text-neon-cyan">{avgScore}</span>
            <span className="text-gray-500 text-sm">/ 10</span>
            <span className="text-gray-600 text-xs">({reviews.length} reseñas)</span>
        </div>
        )}
    </div>

      {/* Formulario — solo si hay sesión */}
    {user ? (
        <div className="mb-8">
        <ReviewForm
            animeId={animeId}
            animeTitle={animeTitle}
            userId={user.id}
            miReview={miReview}
            onSave={handleSave}
        />
        </div>
    ) : (
        <div className="mb-8 glass rounded-xl p-4 border border-dark-border text-center">
        <p className="text-gray-500 text-sm">
            <Link to="/login" className="text-neon-cyan hover:underline">
            Inicia sesión
            </Link>
            {' '}para escribir una reseña
        </p>
        </div>
    )}

      {/* Lista de reseñas */}
    {loading ? (
        <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-dark-card rounded-xl animate-pulse" />
        ))}
        </div>
    ) : reviews.length === 0 ? (
        <div className="text-center py-10">
        <p className="text-4xl mb-3">💬</p>
        <p className="text-gray-500">Sé el primero en reseñar este anime</p>
        </div>
    ) : (
        <div className="flex flex-col gap-4">
        {reviews.map(review => (
            <ReviewCard
            key={review.id}
            review={review}
            currentUserId={user?.id}
            onDelete={handleDelete}
            />
        ))}
        </div>
    )}
    </section>
)
}

export default ReviewSection