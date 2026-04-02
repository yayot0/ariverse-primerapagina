import { supabase } from './supabase'

// Obtener perfil del usuario
export const getPerfil = async (userId) => {
const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

if (error) throw error
return data
}

// Actualizar perfil
export const updatePerfil = async (userId, updates) => {
const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

if (error) throw error
return data
}

// Subir avatar
export const uploadAvatar = async (userId, file) => {
const fileExt  = file.name.split('.').pop()
const filePath = `${userId}/avatar.${fileExt}`

  // Subir imagen al bucket
const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

if (uploadError) throw uploadError

  // Obtener URL pública
const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  // Guardar URL en el perfil
await updatePerfil(userId, { avatar_url: data.publicUrl })

return data.publicUrl
}

// Obtener estadísticas de la lista
export const getEstadisticas = async (userId) => {
const { data, error } = await supabase
    .from('user_anime_list')
    .select('status')
    .eq('user_id', userId)

if (error) throw error

  // Contar por status
const stats = {
    total:      data.length,
    viendo:     data.filter(i => i.status === 'viendo').length,
    completado: data.filter(i => i.status === 'completado').length,
    pendiente:  data.filter(i => i.status === 'pendiente').length,
    favorito:   data.filter(i => i.status === 'favorito').length,
}

return stats
}