import { create } from 'zustand'
import { supabase } from '../services/supabase'

export const useAuthStore = create((set) => ({
user:    null,
loading: true,

  // Inicializar — verificar si hay sesión activa al cargar la app
initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })

    // Escuchar cambios de sesión en tiempo real
    supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null })
    })
},

  // Registro con email y contraseña
signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
},

// Login con Google
signInWithGoogle: async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) throw error
},

  // Login
signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    set({ user: data.user })
    return data
},

  // Logout
signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
},
}))