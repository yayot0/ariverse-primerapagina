import { supabase } from './supabase'

// Obtener reseñas de un anime
export const getReviews = async (animeId) => {
const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
    profiles (username, avatar_url)
    `)
    .eq('anime_id', animeId)
    .order('created_at', { ascending: false })

if (error) throw error
return data
}

// Obtener reseña del usuario actual para un anime
export const getMiReview = async (userId, animeId) => {
const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .single()

if (error?.code === 'PGRST116') return null
if (error) throw error
return data
}

// Crear reseña
export const crearReview = async ({ userId, animeId, animeTitle, rating, contenido }) => {
const { data, error } = await supabase
    .from('reviews')
    .insert({
    user_id:     userId,
    anime_id:    animeId,
    anime_title: animeTitle,
    rating,
    contenido,
    })
    .select(`*, profiles (username, avatar_url)`)
    .single()

if (error) throw error
return data
}

// Actualizar reseña
export const actualizarReview = async ({ userId, animeId, rating, contenido }) => {
const { data, error } = await supabase
    .from('reviews')
    .update({ rating, contenido })
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .select(`*, profiles (username, avatar_url)`)
    .single()

if (error) throw error
return data
}

// Eliminar reseña
export const eliminarReview = async ({ userId, animeId }) => {
const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('user_id', userId)
    .eq('anime_id', animeId)

if (error) throw error
}

// Obtener todas las reseñas de un usuario
export const getMisReviews = async (userId) => {
const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

if (error) throw error
return data
}