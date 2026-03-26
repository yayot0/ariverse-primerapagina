function SkeletonCard() {
    return (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-dark-border" />
    <div className="p-3 space-y-2">
        <div className="h-4 bg-dark-border rounded w-3/4" />
        <div className="h-3 bg-dark-border rounded w-full" />
        <div className="h-3 bg-dark-border rounded w-2/3" />
    </div>
    </div>
)
}

function LoadingGrid({ count = 12 }) {
return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
    ))}
    </div>
)
}

export default LoadingGrid