'use client'

import { useState, useEffect } from 'react'
import { useRef } from 'react'

function EventManager() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  function playBeep() {
    const audio = new Audio('/beep.mp3')
    audio.play().catch((err) => {
      console.error('Erreur audio', err)
    })
  }

  function flashScreen() {
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.backgroundColor = 'white'
    overlay.style.opacity = '1'
    overlay.style.zIndex = '9999'
    document.body.appendChild(overlay)

    setTimeout(() => {
      document.body.removeChild(overlay)
    }, 100)
  }

  function alertEffect() {
    flashScreen()
    playBeep()
  }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      alert('Impossible d\'accéder à la caméra')
      console.error(err)
    }
  }

  const [location, setLocation] = useState<string | null>(null)

  function getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setLocation(`Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`)
        },
        (err) => {
          setLocation("Impossible d'obtenir la position.")
        }
      )
    } else {
      setLocation("Géolocalisation non supportée.")
    }
  }

  const iosButton: React.CSSProperties = {
    padding: '12px 24px',
    margin: '8px',
    border: 'none',
    borderRadius: '22px',
    background: 'linear-gradient(90deg, #f5f6fa 0%, #e1e8ed 100%)',
    color: '#222',
    fontWeight: 600,
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
    cursor: 'pointer',
  }

  const iosButtonActive: React.CSSProperties = {
    ...iosButton,
    background: 'linear-gradient(90deg, #e1e8ed 0%, #f5f6fa 100%)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
  }

  const videoStyle: React.CSSProperties = {
    marginTop: '18px',
    width: '90vw',
    maxWidth: '340px',
    height: '220px',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    background: '#000',
    objectFit: 'cover',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  }

  return (
    <div style={{ padding: 16, maxWidth: 400, margin: '0 auto' }}>
      <h3 style={{ fontFamily: 'San Francisco, Arial, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#222' }}>
        Événements
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={iosButton} onClick={flashScreen}>Flash écran</button>
        <button style={iosButton} onClick={playBeep}>Bip sonore</button>
        <button style={iosButton} onClick={alertEffect}>Tous en même temps</button>
        <button style={iosButton} onClick={openCamera}>Ouvrir la caméra</button>
        <button style={iosButton} onClick={getLocation}>Obtenir la position</button>
      </div>
      {location && (
        <p style={{ textAlign: 'center', marginTop: '12px', color: '#555' }}>
          Position actuelle : <strong>{location}</strong>
        </p>
      )}
      <video ref={videoRef} style={videoStyle} autoPlay muted />
    </div>
  )
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div style={{ padding: '1rem', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
        Installer l’application
      </h3>
      {isIOS && (
        <p style={{ fontSize: '0.95rem', color: '#555' }}>
          Sur votre iPhone, appuyez sur le bouton de partage
          <span role="img" aria-label="share icon">
            {' '}📤{' '}
          </span>
          puis sélectionnez <strong>« Sur l’écran d’accueil »</strong>
          <span role="img" aria-label="plus icon">
            {' '}➕
          </span>
          .
        </p>
      )}
    </div>

  )
}

export default function Page() {
  return (
    <div>
      <EventManager />
      <InstallPrompt />
    </div>
  )
}