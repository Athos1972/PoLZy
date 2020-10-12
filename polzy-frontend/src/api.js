
export const fetchPolicy = async (policy) => {
  const response = await fetch(`/policy/${policy.number}/${policy.date}`)
  const data = await response.json()
  return data
}