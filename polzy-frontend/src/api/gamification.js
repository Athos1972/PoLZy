/*
** Gamification Badges API Calls
*/

export const getBadgeTypes = async (user) => {
  const response = await fetch("/api/badges/types", {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const getBadges = async (user) => {
  const response = await fetch("/api/badges", {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const getBadgeSrc = async (user, route) => {
  const response = await fetch(`/api/badge/${route}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const blob = await response.blob()
  const src = await (window.URL ? window.URL : window.webkitURL).createObjectURL(blob)

  if (response.ok) {
    return src
  }

  throw new Error('Failed fetch badge image')
}

export const makeBadgeSeen = async (user, payload) => {
  const response = await fetch("/api/badges/seen", {
  	method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const getRankings = async (user) => {
  const response = await fetch("/api/rankings", {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}