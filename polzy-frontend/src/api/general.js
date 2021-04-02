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

// file handling
export const uploadFiles = async (user, parentId, fileType, file) => {
  // build URI
  const uri = parentId && fileType ? `/api/upload/${parentId}/${encodeURIComponent(fileType)}` : '/api/upload'

  // create form data with file
  const fileData = new FormData()
  fileData.append('file', file)

  // call api
  const response = await fetch(uri, {
    method: 'POST',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
    },
    body: fileData,
  })

  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

export const getFile = async (user, fileId) => {
  // build URI
  const uri = `/api/documents/${fileId}`

  // call api
  const response = await fetch(uri, {
    method: 'GET',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
    },
  })

  const blob = await response.blob()
  const src = await (window.URL ? window.URL : window.webkitURL).createObjectURL(blob)

  if (response.ok) {
    return src
  }

  throw new Error(response.statusText)
}

export const editFile = async (user, fileId, fileType) => {
  // build URI
  const uri = `/api/documents/${fileId}`

  // call api
  const response = await fetch(uri, {
    method: 'POST',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      fileType: fileType,
    })
  })

  //const blob = await response.blob()
  //const src = await (window.URL ? window.URL : window.webkitURL).createObjectURL(blob)

  if (!response.ok) {
    throw new Error(response.statusText)
  }
}

export const deleteFile = async (user, fileId) => {
  // build URI
  const uri = `/api/documents/${fileId}`

  // call api
  const response = await fetch(uri, {
    method: 'DELETE',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  } 
}

export const getResource = async (user, uri) => {
  // call api
  const response = await fetch(uri, {
    method: 'GET',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
    },
  })

  const blob = await response.blob()
  const src = await (window.URL ? window.URL : window.webkitURL).createObjectURL(blob)

  if (response.ok) {
    return src
  }

  throw new Error(response.statusText)
}

export const getDocuments = async (user, payload) => {
  // call api
  const response = await fetch('/api/remotedocuments', {
    method: 'POST',
    headers:{ 
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const blob = await response.blob()
  const src = await (window.URL ? window.URL : window.webkitURL).createObjectURL(blob)

  return src
}

export const generateEml = async (user, payload) => {
  // call api
  const response = await fetch('/api/generateeml', {
    method: 'POST',
    headers:{
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const blob = await response.blob()
  const src = await (window.URL ? window.URL : window.webkitURL).createObjectURL(blob)

  return src
}