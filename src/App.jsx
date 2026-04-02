import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import AnimeDetalle from './pages/AnimeDetalle'
import Calendario from './pages/Calendario'
import Directorio from './pages/Directorio'
import Home from './pages/Home'
import Login from './pages/Login'
import MiLista from './pages/MiLista'
import NoticiaDetalle from './pages/NoticiaDetalle'
import Noticias from './pages/Noticias'
import Perfil from './pages/Perfil'
import TopAnime from './pages/TopAnime'
import { useAuthStore } from './store/authStore'


function App() {
  const initialize = useAuthStore(state => state.initialize)

useEffect(() => {
  initialize()
}, [])

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/directorio" element={<Directorio />} />
          <Route path="/top"        element={<TopAnime />} />
          <Route path="/noticias"   element={<Noticias />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/mi-lista"   element={<MiLista />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/anime/:id" element={<AnimeDetalle />} />
          <Route path="/noticias/:slug" element={<NoticiaDetalle />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App