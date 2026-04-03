import { supabase } from './supabase'

// Obtener todas las noticias
export const getNoticias = async () => {
const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

if (error) throw error
return data
}

// Obtener noticia por slug
export const getNoticiaPorSlug = async (slug) => {
const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .single()

if (error) throw error
return data
}

// Obtener todas las noticias para el admin (incluye no publicadas)
export const getNoticiasAdmin = async () => {
const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false })

if (error) throw error
return data
}

// Crear noticia
export const crearNoticia = async (noticia) => {
const { data, error } = await supabase
    .from('news_posts')
    .insert(noticia)
    .select()
    .single()

if (error) throw error
return data
}

// Actualizar noticia
export const actualizarNoticia = async (id, updates) => {
const { data, error } = await supabase
    .from('news_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

if (error) throw error
return data
}

// Eliminar noticia
export const eliminarNoticia = async (id) => {

    const { error } = await supabase
    .from('news_posts')
    .delete()
    .eq('id', id)

if (error) throw error
}

// Generar slug desde título
export const generarSlug = (titulo) => {
return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')   // solo letras, números y guiones
    .replace(/\s+/g, '-')            // espacios por guiones
    .replace(/-+/g, '-')             // guiones dobles por uno
    .trim()
}