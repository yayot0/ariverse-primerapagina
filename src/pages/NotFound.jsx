import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function NotFound() {
const navigate          = useNavigate()
const [counter, setCounter] = useState(10)

  // Countdown para redirigir automáticamente al home
useEffect(() => {
    const timer = setInterval(() => {
    setCounter(prev => {
        if (prev <= 1) {
        clearInterval(timer)
        navigate('/')
        return 0
        }
        return prev - 1
    })
    }, 1000)

    return () => clearInterval(timer)
}, [navigate])

return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      {/* Fondo animado */}
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 
                        rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 
                        rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-cyan/10 
                        rounded-full blur-3xl animate-pulse delay-300" />
    </div>

      {/* Grid de puntos */}
    <div
        className="absolute inset-0 opacity-10"
        style={{
        backgroundImage: 'radial-gradient(circle, #ff006e 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        }}
    />

      {/* Contenido */}
    <div className="relative z-10 text-center max-w-lg mx-auto">

        {/* 404 grande */}
        <div className="relative mb-6">
        <h1 className="font-orbitron font-black text-[8rem] md:text-[12rem] leading-none
                        text-transparent bg-clip-text 
                        bg-gradient-to-b from-neon-pink to-neon-purple
                        select-none">
            404
        </h1>
          {/* Efecto glitch */}
        <h1 className="font-orbitron font-black text-[8rem] md:text-[12rem] leading-none
                        text-neon-cyan/20 absolute inset-0 translate-x-1 -translate-y-1
                        select-none">
            404
        </h1>
        </div>

        {/* Mensaje */}
        <div className="glass rounded-2xl p-6 border border-dark-border mb-8">
        <p className="font-orbitron text-neon-pink font-bold text-lg mb-2">
            SIGNAL_LOST
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
            La página que buscas no existe o fue eliminada del universo conocido.
            El sistema te redirigirá automáticamente en{' '}
            <span className="text-neon-cyan font-orbitron font-bold">{counter}</span>
            {' '}segundos.
        </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
            to="/"
            className="px-8 py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80
                    text-white font-semibold transition-all duration-300
                    hover:shadow-neon-purple hover:scale-105 font-orbitron"
        >
            Volver al Inicio
        </Link>
        <Link
            to="/directorio"
            className="px-8 py-3 rounded-xl border border-neon-cyan text-neon-cyan
                    hover:bg-neon-cyan hover:text-dark-bg font-semibold
                    transition-all duration-300 hover:scale-105 font-orbitron"
        >
            Ver Directorio
        </Link>
        </div>

        {/* Barra de progreso del countdown */}
        <div className="mt-8 w-full bg-dark-card rounded-full h-1 overflow-hidden">
        <div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full
                    transition-all duration-1000"
            style={{ width: `${(counter / 10) * 100}%` }}
        />
        </div>
        <p className="text-gray-700 text-xs mt-2 font-orbitron">
        REDIRIGIENDO EN {counter}s...
        </p>

    </div>
    </div>
)
}

export default NotFound