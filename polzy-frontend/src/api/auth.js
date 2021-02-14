/*
** Authentication & Authorization API Calls
*/

// login
export const login = async (email, stage, language) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      email: email,
      stage: stage,
      language: language,
    })
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// update current company
export const getPermissions = async (user, company)=>{
  const response = await fetch('/api/permissions', {
    method: 'POST',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(company)
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}