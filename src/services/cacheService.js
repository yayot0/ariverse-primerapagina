import { supabase } from './supabase'

const CACHE_HOURS = 24 // horas antes de refrescar el caché

// Verificar si el caché es válido
const isCacheValid = (cachedAt) => {
const now        = new Date()
const cached     = new Date(cachedAt)
  const diffHours  = (now - cached) / (1000 * 60 * 60)
return diffHours < CACHE_HOURS
}

// ─── Caché de anime individual ────────────────────────────────────────────────

export const getAnimeFromCache = async (malId) => {
const { data, error } = await supabase
    .from('anime_cache')
    .select('*')
    .eq('mal_id', malId)
    .single()

  if (error?.code === 'PGRST116') return null // No existe
if (error) return null

  // Verificar si el caché sigue válido
if (!isCacheValid(data.cached_at)) return null

  // Reconstruir el objeto de anime desde data_completa
return data.data_completa
}

export const saveAnimeToCache = async (anime) => {
try {
    const { error } = await supabase
    .from('anime_cache')
    .upsert({
        mal_id:          anime.mal_id,
        titulo:          anime.title,
        titulo_english:  anime.title_english,
        synopsis:        anime.synopsis,
        imagen_url:      anime.images?.jpg?.image_url,
        imagen_large_url: anime.images?.jpg?.large_image_url,
        score:           anime.score,
        rank:            anime.rank,
        popularity:      anime.popularity,
        episodes:        anime.episodes,
        status:          anime.status,
        type:            anime.type,
        season:          anime.season,
        year:            anime.year,
        duration:        anime.duration,
        studios:         anime.studios,
        genres:          anime.genres,
        themes:          anime.themes,
        trailer:         anime.trailer,
        members:         anime.members,
        data_completa:   anime,
        cached_at:       new Date().toISOString(),
        updated_at:      new Date().toISOString(),
    }, { onConflict: 'mal_id' })

    if (error) console.error('Error guardando en caché:', error)
} catch (err) {
    console.error('Error en saveAnimeToCache:', err)
}
}

// ─── Caché de listas ──────────────────────────────────────────────────────────

export const getListFromCache = async (key) => {
const { data, error } = await supabase
    .from('top_anime_cache')
    .select('*')
    .eq('page', key)
    .single()

if (error?.code === 'PGRST116') return null
if (error) return null
if (!isCacheValid(data.cached_at)) return null

return data.data
}

export const saveListToCache = async (key, listData) => {
try {
    const { error } = await supabase
    .from('top_anime_cache')
    .upsert({
        page:      key,
        data:      listData,
        cached_at: new Date().toISOString(),
    }, { onConflict: 'page' })

    if (error) console.error('Error guardando lista en caché:', error)
} catch (err) {
    console.error('Error en saveListToCache:', err)
}
}