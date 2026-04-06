import {
  getAnimeFromCache,
  getListFromCache,
  saveAnimeToCache,
  saveListToCache
} from './cacheService'

const BASE_URL     = 'https://api.jikan.moe/v4'
const CACHE_DURATION = 5 * 60 * 1000 // 5 min en memoria

// Caché en memoria para evitar peticiones duplicadas en la misma sesión
const memoryCache = new Map()

const fetchFromAPI = async (endpoint, retries = 3) => {
  // 1. Verificar caché en memoria primero
  const memCached = memoryCache.get(endpoint)
  if (memCached && Date.now() - memCached.timestamp < CACHE_DURATION) {
    return memCached.data
  }

  // 2. Hacer la petición con reintentos
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`)

      if (response.status === 429) {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1500))
          continue
        }
        throw new Error('La API está ocupada, intenta de nuevo en un momento')
      }

      if (!response.ok) throw new Error(`Error en la API: ${response.status}`)

      const data = await response.json()

      // Guardar en caché de memoria
      memoryCache.set(endpoint, { data, timestamp: Date.now() })

      return data

    } catch (err) {
      if (attempt === retries) throw err
      await new Promise(resolve => setTimeout(resolve, attempt * 800))
    }
  }
}

// ─── Top Anime con caché de Supabase ─────────────────────────────────────────
export const getTopAnime = async (limit = 12) => {
  const cacheKey = 9999 // key especial para top anime del home

  // Buscar en caché de Supabase
  const cached = await getListFromCache(cacheKey)
  if (cached) return cached

  // Si no hay caché, buscar en Jikan
  const data = await fetchFromAPI(`/top/anime?limit=${limit}`)
  const result = data.data

  // Guardar en caché de Supabase y en memoria individual
  await saveListToCache(cacheKey, result)
  result.forEach(anime => saveAnimeToCache(anime))

  return result
}

// ─── Temporada actual con caché ───────────────────────────────────────────────
export const getCurrentSeason = async () => {
  const cacheKey = 9998 // key especial para temporada actual

  const cached = await getListFromCache(cacheKey)
  if (cached) return cached

  const data   = await fetchFromAPI('/seasons/now?limit=12')
  const result = data.data

  await saveListToCache(cacheKey, result)
  result.forEach(anime => saveAnimeToCache(anime))

  return result
}

// ─── Detalle de anime con caché ───────────────────────────────────────────────
export const getAnimeById = async (id) => {
  // Buscar en caché de Supabase primero
  const cached = await getAnimeFromCache(Number(id))
  if (cached) return cached

  // Si no hay caché buscar en Jikan
  const data  = await fetchFromAPI(`/anime/${id}`)
  const anime = data.data

  // Guardar en caché
  await saveAnimeToCache(anime)

  return anime
}

// ─── Búsqueda con caché de memoria ───────────────────────────────────────────
export const searchAnimeWithFilters = async ({ query = '', type = '', page = 1 }) => {
  let endpoint = `/anime?page=${page}&limit=20&order_by=score&sort=desc`
  if (query) endpoint += `&q=${encodeURIComponent(query)}`
  if (type)  endpoint += `&type=${type}`

  const data = await fetchFromAPI(endpoint)

  // Cachear cada anime individualmente en Supabase
  if (data.data) {
    data.data.forEach(anime => saveAnimeToCache(anime))
  }

  return data
}

// ─── Temporada por año con caché ─────────────────────────────────────────────
export const getSeasonByYear = async (year, season) => {
  const cacheKey = parseInt(`${year}${['winter','spring','summer','fall'].indexOf(season) + 1}`)

  const cached = await getListFromCache(cacheKey)
  if (cached) return cached

  const data   = await fetchFromAPI(`/seasons/${year}/${season}?limit=25`)
  const result = data.data || []

  await saveListToCache(cacheKey, result)
  result.forEach(anime => saveAnimeToCache(anime))

  return result
}

// ─── Sin cambios ──────────────────────────────────────────────────────────────
export const searchAnime = async (query) => {
  const data = await fetchFromAPI(`/anime?q=${encodeURIComponent(query)}&limit=12`)
  return data.data
}

export const getAnimeCharacters = async (id) => {
  const data = await fetchFromAPI(`/anime/${id}/characters`)
  return data.data
}

export const getAnimeVideos = async (id) => {
  const data = await fetchFromAPI(`/anime/${id}/videos`)
  return data.data
}

export const getGenres = async () => {
  const data = await fetchFromAPI('/genres/anime')
  return data.data
}

export const getAnimeByGenre = async (genreId, limit = 12) => {
  const data = await fetchFromAPI(`/anime?genres=${genreId}&limit=${limit}&order_by=score&sort=desc`)
  return data.data
}