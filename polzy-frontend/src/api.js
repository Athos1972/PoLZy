
export const getStages = async () => {
  const response = await fetch('/stage')
  const data = await response.json()
  return data
}

// policy calls 
export const fetchPolicy = async (policy) => {
  const response = await fetch(`/policy/${policy.policy_number}/${policy.effective_date}`)
  const data = await response.json()
  return data
}

export const executeActivity = async (activity) => {
  const response = await fetch('/activity', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(activity),
  })
  const data = await response.json()
  return data
}

// antrag calls
export const getProducts = async (stage) => {
  const response = await fetch(`/${stage}/products`)
  const data = await response.json()
  return data
}

export const fetchAntrag = async (antrag) => {
  const response = await fetch(`/${antrag.stage}/antrag/${antrag.product_line.name}`)
  const data = await response.json()
  return data
}

export const executeAntrag = async (stage, antrag) => {
  const response = await fetch(`/${stage}/antrag`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(antrag),
  })
  const data = await response.json()
  return data
}
