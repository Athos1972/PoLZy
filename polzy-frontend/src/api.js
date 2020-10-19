
export const fetchPolicy = async (policy) => {
  const response = await fetch(`/policy/${policy.number}/${policy.date}`)
  const data = await response.json()
  return data
}

export const executeActivity = async (data) => {
  const response = await fetch('/activity', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data),
  })
}