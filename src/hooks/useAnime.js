import { useEffect, useState } from 'react'

// Hook genérico que maneja cualquier llamada a la API
export const useAnime = (fetchFunction, dependencies = []) => {
const [data, setData]       = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError]     = useState(null)

useEffect(() => {
    let cancelled = false // evita actualizar estado si el componente ya no existe

    const fetchData = async () => {
    try {
        setLoading(true)
        setError(null)
        const result = await fetchFunction()
        if (!cancelled) setData(result)
    } catch (err) {
        if (!cancelled) setError(err.message)
    } finally {
        if (!cancelled) setLoading(false)
    }
    }

    fetchData()

    // Cleanup — se ejecuta si el componente se desmonta antes de que termine el fetch
    return () => { cancelled = true }
}, dependencies)

return { data, loading, error }
}