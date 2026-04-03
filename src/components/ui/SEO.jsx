import { Helmet } from 'react-helmet-async'

function SEO({
title       = 'AriVerse - Tu Portal de Anime',
description = 'Descubre, explora y organiza tu colección de anime. Noticias, rankings, calendario de estrenos y mucho más.',
image       = 'https://ariverse-primerapagina.vercel.app/og-image.jpg',
url         = 'https://ariverse-primerapagina.vercel.app',
type        = 'website',
}) {
const fullTitle = title === 'AriVerse - Tu Portal de Anime'
    ? title
    : `${title} | AriVerse`

return (
    <Helmet>
      {/* Básico */}
    <title>{fullTitle}</title>
    <meta name="description" content={description} />

      {/* Open Graph — para WhatsApp, Facebook, etc */}
    <meta property="og:title"       content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image"       content={image} />
    <meta property="og:url"         content={url} />
    <meta property="og:type"        content={type} />
    <meta property="og:site_name"   content="AriVerse" />

      {/* Twitter Card */}
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image"       content={image} />

      {/* Otros */}
    <meta name="theme-color" content="#7c3aed" />
    <link rel="canonical" href={url} />
    </Helmet>
)
}

export default SEO