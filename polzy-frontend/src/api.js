
export const getStages = async () => {
  const response = await fetch('/stage')
  const data = await response.json()
  return data
}

export const getProducts = async () => {
  const response = await fetch('/antrag')
  const data = await response.json()
  return data
}

export const fetchPolicy = async (policy) => {
  const response = await fetch(`/policy/${policy.policy_number}/${policy.effective_date}`)
  const data = await response.json()
  return data
}

export const fetchAntrag = async (antrag) => {
  const response = await fetch(`/antrag/${antrag.product_line.name}/${antrag.stage}`)
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