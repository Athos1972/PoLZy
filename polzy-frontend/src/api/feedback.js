/*
** Feedback API Calls
*/

export const reportProblem = async (user, payload) => {
  const response = await fetch("/report", {
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