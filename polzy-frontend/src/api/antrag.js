/*
** Antrag Calls
*/

export const getProducts = async (user) => {
  const response = await fetch('/api/antrag/products', {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const fetchAntrag = async (user, antrag) => {
  const response = await fetch(`/api/antrag/new/${antrag.product_line.name}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const cloneAntrag = async (user, antragId) => {
  const response = await fetch(`/api/antrag/clone/${antragId}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const loadAntrag = async (user, antragId) => {
  const response = await fetch(`/api/antrag/records/${antragId}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const updateAntragFields = async (user, antrag) => {
  const response = await fetch(`/api/antrag/update`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(antrag),
  })
  const data = await response.json()

  //console.log('update response')
  //console.log(data)

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const executeAntrag = async (user, antrag) => {
  const response = await fetch(`/api/antrag/execute`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(antrag),
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// search calls
export const searchPortal = async (user, id, target, value) => {
  const searchUri = target === "antrag" ? "/api/antrag/records/search" : (
    id ? `/api/search/${id}`: '/api/search'
  )
  const response = await fetch(searchUri, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      activity: target,
      value: value,
    }),
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}