import { useState } from 'react'

function SearchBar({ onSearch, placeholder = 'Buscar anime...' }) {
const [value, setValue] = useState('')

const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value)
}

const handleClear = () => {
    setValue('')
    onSearch('')
}

return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      {/* Icono lupa */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        🔍
    </div>

    <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-card border border-dark-border rounded-xl 
                pl-12 pr-12 py-3 text-white placeholder-gray-600
                focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan
                transition-all duration-300"
    />

      {/* Botón limpiar */}
    {value && (
        <button
        type="button"
        onClick={handleClear}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 
                    hover:text-white transition-colors"
        >
        ✕
        </button>
    )}
    </form>
)
}

export default SearchBar