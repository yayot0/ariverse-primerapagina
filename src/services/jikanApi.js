const BASE_URL = 'https://api.jikan.moe/v4'

// Cache simple en memoria para no repetir peticiones
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

const fetchFromAPI = async (endpoint, retries = 3) => {
  // Si ya tenemos el resultado en caché y no ha expirado, lo devolvemos
const cached = cache.get(endpoint)
if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
}

for (let attempt = 1; attempt <= retries; attempt++) {
    try {
    const response = await fetch(`${BASE_URL}${endpoint}`)

      // Si nos da 429 (too many requests), esperamos y reintentamos
    if (response.status === 429) {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000))
        continue
        }
        throw new Error('La API está ocupada, espera un momento e intenta de nuevo')
    }

    if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()

      // Guardamos en caché
    cache.set(endpoint, { data, timestamp: Date.now() })

    return data

    } catch (err) {
      // Si es el último intento, lanzamos el error
    if (attempt === retries) throw err
      // Si no, esperamos un poco y reintentamos
      await new Promise(resolve => setTimeout(resolve, attempt * 800))
    }
}
}

export const getTopAnime = async (limit = 12) => {
const data = await fetchFromAPI(`/top/anime?limit=${limit}`)
return data.data
}

export const getCurrentSeason = async () => {
const data = await fetchFromAPI('/seasons/now?limit=12')
return data.data
}

export const searchAnime = async (query) => {
const data = await fetchFromAPI(`/anime?q=${encodeURIComponent(query)}&limit=12`)
return data.data
}

export const getAnimeById = async (id) => {
const data = await fetchFromAPI(`/anime/${id}`)
return data.data
}

export const getSeasons = async () => {
const data = await fetchFromAPI('/seasons')
return data.data
}

export const getAnimeByGenre = async (genreId, limit = 12) => {
const data = await fetchFromAPI(`/anime?genres=${genreId}&limit=${limit}&order_by=score&sort=desc`)
return data.data
}

export const getGenres = async () => {
const data = await fetchFromAPI('/genres/anime')
return data.data
}

export const searchAnimeWithFilters = async ({ query = '', type = '', page = 1 }) => {
let endpoint = `/anime?page=${page}&limit=20&order_by=score&sort=desc`
if (query) endpoint += `&q=${encodeURIComponent(query)}`
if (type)  endpoint += `&type=${type}`
const data = await fetchFromAPI(endpoint)
return data
}

export const getAnimeCharacters = async (id) => {
const data = await fetchFromAPI(`/anime/${id}/characters`)
return data.data
}

export const getAnimeVideos = async (id) => {
const data = await fetchFromAPI(`/anime/${id}/videos`)
return data.data
}