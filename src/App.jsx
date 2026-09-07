import { useState, useRef, useEffect } from 'react'
import { songs } from './data'
import './index.css'

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [activeMenu, setActiveMenu] = useState('Home')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)

  const [favorites, setFavorites] = useState([])
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0)
  
  const audioRef = useRef(null)
  const bannerRef = useRef(null)

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.volume = volume
    }
  }, [currentSong])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skipForward = () => {
    const activeList = activeMenu === 'Favorites' 
      ? songs.filter(s => favorites.includes(s.id))
      : filteredSongs

    if (activeList.length === 0) return

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * activeList.length)
      setCurrentSong(activeList[randomIndex])
    } else {
      const currentIndex = activeList.findIndex((song) => song.id === currentSong?.id)
      const nextIndex = (currentIndex + 1) % activeList.length
      setCurrentSong(activeList[nextIndex])
    }
  }

  const skipBackward = () => {
    const activeList = activeMenu === 'Favorites' 
      ? songs.filter(s => favorites.includes(s.id))
      : filteredSongs

    if (activeList.length === 0) return
    const currentIndex = activeList.findIndex((song) => song.id === currentSong?.id)
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length
    setCurrentSong(activeList[prevIndex])
  }

  const handleSongEnded = () => {
    if (repeatMode === 2) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      skipForward()
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleSeek = (e) => {
    const time = e.target.value
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const scrollBannerRight = () => {
    if (bannerRef.current) {
      bannerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (usernameInput.trim() !== '') {
      setCurrentUser(usernameInput.trim())
      setActiveMenu('Home')
      setUsernameInput('')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setShowLogoutMenu(false)
    setActiveMenu('Home')
  }

  const toggleFavorite = (e, songId) => {
    e.stopPropagation()
    if (favorites.includes(songId)) {
      setFavorites(favorites.filter(id => id !== songId))
    } else {
      setFavorites([...favorites, songId])
    }
  }

  const handleShuffleClick = () => {
    if (!isShuffle) {
      setIsShuffle(true)
      setRepeatMode(0)
    } else {
      setIsShuffle(false)
    }
  }

  const handleRepeatClick = () => {
    setIsShuffle(false)
    setRepeatMode((prev) => (prev + 1) % 3)
  }

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const displayedSongs = activeMenu === 'Favorites' 
    ? songs.filter(song => favorites.includes(song.id))
    : filteredSongs

  return (
    <div className="layout-container">
      {/* --- SOL MENÜ --- */}
      <aside 
        className={`sidebar ${isSidebarOpen ? 'expanded' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => {
          setIsSidebarOpen(false)
          setShowLogoutMenu(false)
        }}
      >
        <div className="sidebar-logo" onClick={() => setActiveMenu('Home')} style={{ cursor: 'pointer' }}>
          <h2>{isSidebarOpen ? 'Overworld' : 'OW'}</h2>
        </div>
        
        <div className="sidebar-menu-container">
          <div className="sidebar-menu">
            <p className="menu-category">Keşfet</p>
            <ul>
              <li className={activeMenu === 'Home' ? 'active' : ''} onClick={() => setActiveMenu('Home')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span className="menu-text">Ana Sayfa</span>
              </li>
              <li className={activeMenu === 'Search' ? 'active' : ''} onClick={() => setActiveMenu('Search')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <span className="menu-text">Arama</span>
              </li>
            </ul>

            <p className="menu-category">Kütüphane</p>
            <ul>
              <li className={activeMenu === 'Library' ? 'active' : ''} onClick={() => setActiveMenu('Library')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                <span className="menu-text">Şarkılarım</span>
              </li>
              <li className={activeMenu === 'Favorites' ? 'active' : ''} onClick={() => setActiveMenu('Favorites')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span className="menu-text">Favoriler</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-footer" style={{ position: 'relative' }}>
            {currentUser ? (
              <div 
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#ff7700', whiteSpace: 'nowrap' }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                <span className="menu-text" style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser}</span>
              </div>
            ) : (
              <div className={activeMenu === 'Login' ? 'active' : ''} onClick={() => setActiveMenu('Login')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                <span className="menu-text">Giriş Yap</span>
              </div>
            )}

            {showLogoutMenu && currentUser && (
              <div className="logout-popup" onClick={handleLogout}>
                <span className="logout-text">Çıkış Yap</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <main className="main-area">
        <div className="top-search-bar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#888"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input 
            type="text" 
            placeholder="Şarkı, sanatçı veya tür ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeMenu === 'Login' && !currentUser && (
          <div className="login-card">
            <h2 className="login-title">Overworld'e Giriş Yap</h2>
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="login-field">
                <label>Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Kullanıcı adınızı girin..."
                  required
                  className="login-input"
                />
              </div>
              <div className="login-field">
                <label>Şifre</label>
                <input type="password" placeholder="••••••••" className="login-input" />
              </div>
              <button type="submit" className="login-submit-btn">Giriş Yap</button>
            </form>
          </div>
        )}

        {activeMenu === 'Home' && searchQuery === '' && (
          <>
            <div className="banner-section">
              <div className="section-header-flex">
                <h2 className="section-title">Senin İçin Seçilenler</h2>
                <button className="scroll-arrow-btn" onClick={scrollBannerRight}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </button>
              </div>

              <div className="banner-scroll-container" ref={bannerRef}>
                {songs.slice(0, 5).map((song) => {
                  const isFav = favorites.includes(song.id)
                  return (
                    <div 
                      key={`banner-${song.id}`}
                      className={`banner-card ${currentSong?.id === song.id ? 'active' : ''}`}
                      onClick={() => setCurrentSong(song)}
                    >
                      <img src={song.cover} alt={song.title} className="banner-image" />
                      <div className="banner-gradient-overlay"></div>

                      <button 
                        className={`favorite-btn ${isFav ? 'favorited' : ''}`}
                        onClick={(e) => toggleFavorite(e, song.id)}
                        title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? "#ff7700" : "currentColor"}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>

                      <div className="banner-card-content">
                        <span className="banner-tag">Özel Seçim</span>
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                      </div>
                      <div className="banner-play-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <h2 className="section-title" style={{ marginTop: '3rem' }}>Tüm Parçalar</h2>
          </>
        )}

        {searchQuery !== '' && (
          <h2 className="section-title">Arama Sonuçları: "{searchQuery}"</h2>
        )}

        {activeMenu === 'Library' && (
          <h2 className="section-title">Kütüphanem (Tüm Şarkılar)</h2>
        )}

        {activeMenu === 'Favorites' && (
          <h2 className="section-title">Favori Şarkıların</h2>
        )}

        {activeMenu !== 'Login' && (
          <div className="music-grid">
            {displayedSongs.map((song) => {
              const isFav = favorites.includes(song.id)
              return (
                <div 
                  key={song.id} 
                  className={`music-card ${currentSong?.id === song.id ? 'active' : ''}`}
                  onClick={() => setCurrentSong(song)}
                >
                  <div className="card-image-container">
                    <img src={song.cover} alt={song.title} className="card-image" />
                    
                    <button 
                      className={`favorite-btn ${isFav ? 'favorited' : ''}`}
                      onClick={(e) => toggleFavorite(e, song.id)}
                      title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? "#ff7700" : "currentColor"}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>

                    <div className="card-play-overlay">
                      <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className="card-info">
                    <h3>{song.title}</h3>
                    <p>{song.category} • {song.artist}</p>
                  </div>
                </div>
              )
            })}
            {displayedSongs.length === 0 && (
              <p style={{ color: '#888' }}>
                {activeMenu === 'Favorites' ? 'Henüz favorilere şarkı eklemediniz.' : 'Aradığınız kriterlere uygun şarkı bulunamadı.'}
              </p>
            )}
          </div>
        )}
      </main>

      {/* --- SABİT MÜZİK ÇALAR --- */}
      {currentSong && (
        <div className="player-container">
          <div className="player-info">
            <img src={currentSong.cover} alt="cover" className="player-cover" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <h4>{currentSong.title}</h4>
                <p>{currentSong.artist}</p>
              </div>
              <button 
                className={`player-favorite-btn ${favorites.includes(currentSong.id) ? 'favorited' : ''}`}
                onClick={(e) => toggleFavorite(e, currentSong.id)}
                title={favorites.includes(currentSong.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill={favorites.includes(currentSong.id) ? "#ff7700" : "#b3b3b3"}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="custom-player-controls">
            <audio 
              ref={audioRef} 
              src={currentSong.audio} 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(audioRef.current.duration)}
              onEnded={handleSongEnded} 
            />
            
            <div className="playback-controls">
              <button 
                className={`control-btn ${isShuffle ? 'active-mode' : ''}`} 
                onClick={handleShuffleClick}
                title={isShuffle ? "Karıştır Kapat" : "Karıştır Aç"}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={isShuffle ? "#ff7700" : "currentColor"}>
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                </svg>
              </button>

              <button className="control-btn" onClick={skipBackward} title="Önceki Şarkı">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>

              <button className="play-pause-btn" onClick={togglePlay}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              <button className="control-btn" onClick={skipForward} title="Sonraki Şarkı">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>

              <button 
                className={`control-btn ${repeatMode > 0 ? 'active-mode' : ''}`} 
                onClick={handleRepeatClick}
                title={repeatMode === 0 ? "Döngü Kapalı" : repeatMode === 1 ? "Tümünü Tekrarla" : "Tek Şarkıyı Tekrarla"}
                style={{ position: 'relative' }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={repeatMode > 0 ? "#ff7700" : "currentColor"}>
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
                {repeatMode === 2 && (
                  <span className="repeat-one-indicator">1</span>
                )}
              </button>
            </div>

            <div className="progress-container">
              <span>{formatTime(currentTime)}</span>
              <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek} className="progress-bar" />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="volume-container">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#b3b3b3"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="volume-bar" />
          </div>
        </div>
      )}
    </div>
  )
}

export default App