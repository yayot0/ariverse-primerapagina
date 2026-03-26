// Tipos de anime disponibles en la API
const ANIME_TYPES = [
{ value: '',        label: 'Todos' },
{ value: 'tv',      label: 'TV' },
{ value: 'movie',   label: 'Película' },
{ value: 'ova',     label: 'OVA' },
{ value: 'special', label: 'Especial' },
{ value: 'ona',     label: 'ONA' },
]

function FilterBar({ selectedType, onTypeChange }) {
return (
    <div className="flex flex-wrap gap-2 justify-center">
    {ANIME_TYPES.map((type) => (
        <button
        key={type.value}
        onClick={() => onTypeChange(type.value)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${selectedType === type.value
            ? 'bg-neon-purple text-white shadow-neon-purple'
            : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-purple hover:text-white'
            }`}
        >
        {type.label}
        </button>
    ))}
    </div>
)
}

export default FilterBar