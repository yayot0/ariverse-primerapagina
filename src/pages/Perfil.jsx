import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMiLista } from '../services/listaService'
import { getEstadisticas, getPerfil, updatePerfil, uploadAvatar } from '../services/perfilService'
import { useAuthStore } from '../store/authStore'

// ─── Componente StatCard ──────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
const colors = {
    cyan:   'text-neon-cyan   border-neon-cyan/20   bg-neon-cyan/5',
    purple: 'text-neon-purple border-neon-purple/20 bg-neon-purple/5',
    green:  'text-green-400   border-green-400/20   bg-green-400/5',
    yellow: 'text-yellow-400  border-yellow-400/20  bg-yellow-400/5',
    pink:   'text-neon-pink   border-neon-pink/20   bg-neon-pink/5',
}

return (
    <div className={`rounded-xl border p-4 text-center ${colors[color]}`}>
    <p className={`font-orbitron font-bold text-2xl ${colors[color].split(' ')[0]}`}>
        {value}
    </p>
    <p className="text-gray-500 text-xs mt-1">{label}</p>
    </div>
)
}

// ─── Componente Avatar ────────────────────────────────────────────────────────
function Avatar({ perfil, user, onUpload }) {
const fileInputRef = useRef(null)
const [uploading, setUploading] = useState(false)

const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tamaño máximo 2MB
    if (file.size > 2 * 1024 * 1024) {
    alert('La imagen debe ser menor a 2MB')
    return
    }

    try {
    setUploading(true)
    const url = await uploadAvatar(user.id, file)
    onUpload(url)
    } catch {
    alert('Error al subir la imagen')
    } finally {
    setUploading(false)
    }
}

return (
    <div className="relative group">
      {/* Avatar */}
    <div className="w-24 h-24 rounded-full border-4 border-neon-purple 
                    shadow-neon-purple overflow-hidden bg-dark-card">
        {perfil?.avatar_url ? (
        <img
            src={perfil.avatar_url}
            alt="Avatar"
            className="w-full h-full object-cover"
        />
        ) : (
        <div className="w-full h-full flex items-center justify-center bg-neon-purple/20">
            <span className="font-orbitron font-bold text-3xl text-neon-purple">
            {user?.email?.[0].toUpperCase()}
            </span>
        </div>
        )}
    </div>

      {/* Botón cambiar foto */}
    <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 rounded-full bg-dark-bg/70 opacity-0 
                group-hover:opacity-100 transition-opacity flex items-center 
                justify-center text-xs text-white font-medium"
    >
        {uploading ? '...' : '📷'}
    </button>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
    />
    </div>
)
}

// ─── Formulario editar perfil ─────────────────────────────────────────────────
function EditarPerfil({ perfil, userId, onSave }) {
const [username, setUsername] = useState(perfil?.username || '')
const [bio, setBio]           = useState(perfil?.bio || '')
const [loading, setLoading]   = useState(false)
const [saved, setSaved]       = useState(false)

const handleSave = async () => {
    try {
    setLoading(true)
    const updated = await updatePerfil(userId, { username, bio })
    onSave(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    } catch {
    alert('Error al guardar')
    } finally {
    setLoading(false)
    }
}

return (
    <div className="glass rounded-xl p-6 border border-dark-border">
    <h3 className="font-orbitron font-bold text-lg text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-neon-purple rounded-full" />
        Editar Perfil
    </h3>

    <div className="flex flex-col gap-4">
        {/* Username */}
        <div>
        <label className="text-gray-400 text-sm mb-1 block">
            Nombre de usuario
        </label>
        <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
            maxLength={30}
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                    text-white placeholder-gray-600 text-sm
                    focus:outline-none focus:border-neon-purple transition-all"
        />
        </div>

        {/* Bio */}
        <div>
        <label className="text-gray-400 text-sm mb-1 block">
            Bio
        </label>
        <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Cuéntanos algo sobre ti..."
            maxLength={150}
            rows={3}
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3
                    text-white placeholder-gray-600 text-sm resize-none
                    focus:outline-none focus:border-neon-purple transition-all"
        />
        <p className="text-gray-600 text-xs mt-1 text-right">
            {bio.length}/150
        </p>
        </div>

        {/* Botón guardar */}
        <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-2 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                    text-white text-sm font-medium transition-all
                    over:shadow-neon-purple disabled:opacity-50 self-start"
        >
        {loading ? 'Guardando...' : saved ? '✅ Guardado' : 'Guardar Cambios'}
        </button>
    </div>
    </div>
)
}

// ─── Página principal ─────────────────────────────────────────────────────────
function Perfil() {
const { user }              = useAuthStore()
const navigate              = useNavigate()
const [perfil, setPerfil]   = useState(null)
const [stats, setStats]     = useState(null)
const [lista, setLista]     = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
    if (!user) { navigate('/login'); return }

    const fetchData = async () => {
    try {
        const [perfilData, statsData, listaData] = await Promise.all([
        getPerfil(user.id),
        getEstadisticas(user.id),
        getMiLista(user.id),
        ])
        setPerfil(perfilData)
        setStats(statsData)
        setLista(listaData.slice(0, 6))
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
    }

    fetchData()
}, [user])

if (!user) return null

if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
    <div className="h-40 bg-dark-card rounded-xl mb-6" />
    <div className="grid grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-dark-card rounded-xl" />
        ))}
    </div>
    </div>
)

return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header del perfil ── */}
    <div className="glass rounded-2xl border border-dark-border overflow-hidden mb-6">

        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-neon-purple/30 via-neon-cyan/20 to-neon-pink/30 relative">
        <div
            className="absolute inset-0 opacity-30"
            style={{
            backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            }}
        />
        </div>

        {/* Info del usuario */}
        <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">

            {/* Avatar */}
            <Avatar
            perfil={perfil}
            user={user}
            onUpload={(url) => setPerfil(prev => ({ ...prev, avatar_url: url }))}
            />

            {/* Nombre y bio */}
            <div className="flex-1 pb-1">
            <h1 className="font-orbitron font-bold text-xl text-white">
                {perfil?.username || user.email?.split('@')[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                {perfil?.bio || 'Sin bio todavía'}
            </p>
            <p className="text-gray-600 text-xs mt-2">
                {user.email}
            </p>
            </div>

            {/* Link a Mi Lista */}
            <Link
            to="/mi-lista"
            className="px-4 py-2 rounded-lg border border-neon-purple text-neon-purple
                        text-sm hover:bg-neon-purple hover:text-white transition-all"
            >
            Ver Mi Lista completa
            </Link>
        </div>
        </div>
    </div>

      {/* ── Estadísticas ── */}
    {stats && (
        <div className="mb-6">
        <h2 className="font-orbitron font-bold text-lg text-white mb-4 flex items-center gap-3">
            <div className="w-1 h-5 bg-neon-cyan rounded-full" />
            Estadísticas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard label="Total"      value={stats.total}      color="cyan" />
            <StatCard label="Viendo"     value={stats.viendo}     color="purple" />
            <StatCard label="Completado" value={stats.completado} color="green" />
            <StatCard label="Pendiente"  value={stats.pendiente}  color="yellow" />
            <StatCard label="Favoritos"  value={stats.favorito}   color="pink" />
        </div>
        </div>
    )}

      {/* ── Animes recientes ── */}
    {lista.length > 0 && (
        <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron font-bold text-lg text-white flex items-center gap-3">
            <div className="w-1 h-5 bg-neon-pink rounded-full" />
            Agregados Recientemente
            </h2>
            <Link to="/mi-lista" className="text-neon-cyan text-sm hover:underline">
            Ver todos →
            </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {lista.map(item => (
            <Link
                key={item.id}
                to={`/anime/${item.anime_id}`}
                className="group relative rounded-xl overflow-hidden aspect-[3/4]
                        border border-dark-border hover:border-neon-purple transition-all"
            >
                <img
                src={item.anime_image}
                alt={item.anime_title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                <p className="absolute bottom-1 left-0 right-0 text-center text-white 
                            text-xs font-medium px-1 line-clamp-1">
                {item.anime_title}
                </p>
            </Link>
            ))}
        </div>
        </div>
    )}

      {/* ── Editar perfil ── */}
    <EditarPerfil
        perfil={perfil}
        userId={user.id}
        onSave={(updated) => setPerfil(updated)}
    />

    </div>
)
}

export default Perfil