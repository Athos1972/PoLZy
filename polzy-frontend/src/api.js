
export const getStages = async () => {
  const response = await fetch('/stage')
  const data = await response.json()
  return data
}

// policy calls 
export const fetchPolicy = async (policy) => {
  const response = await fetch(`/policy/${policy.policy_number}/${policy.effective_date}`)
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const executeActivity = async (activity) => {
  const response = await fetch('/activity', {
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
export const searchPortal = async (lang, stage, target, value) => {
  const response = await fetch(`/${lang}/${stage}/search`, {
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
