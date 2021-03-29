/*
** Policy Calls
*/ 
export const fetchPolicy = async (user, policy) => {
  const response = await fetch(`/api/policy/${policy.policy_number}/${policy.effective_date}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const deletePolicy = async (user, policyId) => {
  const response = await fetch(`/api/policy/delete/${policyId}`, {
    method: 'DELETE',
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const executeActivity = async (user, activity) => {
  const response = await fetch('/api/policy/activity', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(activity),
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}


export const updatePolicyFields = async (user, payload) => {
  const response = await fetch(`/api/policy/update`, {
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


// partner's policy search
export const getCustomerPolicies = async (user, partner) => {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      activity: 'partnerDetails',
      value: partner,
    }),
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}