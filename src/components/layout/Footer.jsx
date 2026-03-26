import { Link } from 'react-router-dom'

function Footer() {
return (
    <footer className="border-t border-dark-border mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
        <div className="flex items-center gap-2">
            <span className="font-orbitron font-black text-lg text-neon-cyan">ARI</span>
            <span className="font-orbitron font-black text-lg text-neon-purple">VERSE</span>
        </div>

          {/* Links */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/"           className="hover:text-neon-cyan transition-colors">Inicio</Link>
            <Link to="/directorio" className="hover:text-neon-cyan transition-colors">Directorio</Link>
            <Link to="/top"        className="hover:text-neon-cyan transition-colors">Top Anime</Link>
            <Link to="/noticias"   className="hover:text-neon-cyan transition-colors">Noticias</Link>
        </div>

          {/* Copyright */}
        <p className="text-gray-600 text-sm">
            © 2026 AriVerse. Hecho por Yahir
        </p>

        </div>
    </div>
    </footer>
)
}

export default Footer