import { supabase } from './supabase'

// Obtener toda la lista del usuario
export const getMiLista = async (userId) => {
const { data, error } = await supabase
    .from('user_anime_list')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

if (error) throw error
return data
}

// Agregar anime a la lista
export const agregarAnime = async ({ userId, animeId, animeTitle, animeImage, status }) => {
const { data, error } = await supabase
    .from('user_anime_list')
    .insert({
    user_id:     userId,
    anime_id:    animeId,
    anime_title: animeTitle,
    anime_image: animeImage,
    status,
    })
    .select()
    .single()

if (error) throw error
return data
}

// Actualizar estado de un anime
export const actualizarEstado = async ({ userId, animeId, status, score }) => {
const updateData = { status }
if (score !== undefined) updateData.score = score

const { data, error } = await supabase
    .from('user_anime_list')
    .update(updateData)
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .select()
    .single()

if (error) throw error
return data
}

// Eliminar anime de la lista
export const eliminarAnime = async ({ userId, animeId }) => {
const { error } = await supabase
    .from('user_anime_list')
    .delete()
    .eq('user_id', userId)
    .eq('anime_id', animeId)

if (error) throw error
}

// Verificar si un anime ya está en la lista
export const verificarEnLista = async ({ userId, animeId }) => {
const { data, error } = await supabase
    .from('user_anime_list')
    .select('*')
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .single()

  if (error?.code === 'PGRST116') return null // No encontrado
if (error) throw error
return data
}