
export const getStages = async () => {
  const response = await fetch('/stage')
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// policy calls 
export const fetchPolicy = async (lang, stage, policy) => {
  const response = await fetch(`/${lang}/${stage}/policy/${policy.policy_number}/${policy.effective_date}`)
  const data = await response.json()

  console.log('Policy Response:')
  console.log(response)
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const executeActivity = async (lang, stage, activity) => {
  const response = await fetch(`/${lang}/${stage}/activity`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(activity),
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// antrag calls
export const getProducts = async (lang, stage) => {
  const response = await fetch(`/${lang}/${stage}/antrag/products`)
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const fetchAntrag = async (lang, antrag) => {
  const response = await fetch(`/${lang}/${antrag.stage}/antrag/create/${antrag.product_line.name}`)
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const cloneAntrag = async (lang, stage, antragId) => {
  const response = await fetch(`/${lang}/${stage}/antrag/copy/${antragId}`)
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const updateAntragFields = async (lang, stage, antrag) => {
  const response = await fetch(`/${lang}/${stage}/antrag/update`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(antrag),
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const executeAntrag = async (lang, stage, antrag) => {
  const response = await fetch(`/${lang}/${stage}/antrag/execute`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(antrag),
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// search calls
export const searchPortal = async (lang, stage, id, target, value) => {
  const response = await fetch(`/${lang}/${stage}/search/${id}`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
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
