/*
** General API Calls
*/

// get available stages
export const getStages = async () => {
  const response = await fetch('/api/stages')
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// get value list
export const getValueList = async (user, payload) => {
  const response = await fetch('/api/values', {
    method: 'POST',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

// upload file
export const uploadFiles = async (user, file) => {
  // create form data with file
  const fileData = new FormData()
  fileData.append('file', file)

  // call api
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
      //'content-type': 'multipart/form-data',
    },
    body: fileData,
  })

  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)

}