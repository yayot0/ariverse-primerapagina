function Pagination({ currentPage, totalPages, onPageChange }) {
  // No mostrar si solo hay una página
if (totalPages <= 1) return null

  // Limitar páginas visibles a 5
const getVisiblePages = () => {
    const pages = []
    let start = Math.max(1, currentPage - 2)
    let end   = Math.min(totalPages, start + 4)

    // Ajustar si estamos cerca del final
    if (end - start < 4) start = Math.max(1, end - 4)

    for (let i = start; i <= end; i++) pages.push(i)
    return pages
}

return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {/* Botón anterior */}
    <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border 
                text-gray-400 hover:border-neon-cyan hover:text-neon-cyan 
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
    >
        ← Anterior
    </button>

      {/* Números de página */}
    {getVisiblePages().map((page) => (
        <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300
            ${currentPage === page
            ? 'bg-neon-purple text-white shadow-neon-purple'
            : 'bg-dark-card border border-dark-border text-gray-400 hover:border-neon-purple hover:text-white'
            }`}
        >
        {page}
        </button>
    ))}

      {/* Botón siguiente */}
    <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border 
                text-gray-400 hover:border-neon-cyan hover:text-neon-cyan 
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
    >
        Siguiente →
    </button>
    </div>
)
}

export default Pagination