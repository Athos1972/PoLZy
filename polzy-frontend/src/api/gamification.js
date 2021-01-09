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

export const makeBadgeSeen = async (user, payload) => {
  const response = await fetch("/api/badges", {
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