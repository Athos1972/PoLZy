import React, { useState } from 'react'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'

function App() {
  const [accessToken, setAccessToken] = useState(false)

  const handleLogin = () => setAccessToken(true)
  const handlLogout = () => setAccessToken(false)

  if (accessToken) {
    return <HomeView auth={handlLogout} />
  }

  return <LoginView auth={handleLogin} />
}

export default App;
