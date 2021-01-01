/*
** Administartion API Calls
*/

export const fetchAdminData = async (user) => {
  const response = await fetch("/api/admin", {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const manageUserInCompany = async(user, action, payload) => {
  const response = await fetch(`/api/admin/user-company/${action}`, {
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

export const manageChildCompany = async(user, action, payload) => {
  const response = await fetch(`/api/admin/child-company/${action}`, {
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