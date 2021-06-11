/**
 * General back-end API calls
 *
 * @category API Calls
 * @module General
 */


/**
 * GET `/api/stages`<br/>
 * Retrieves a list of the possible stages of PoLZy back-end.
 *
 * @async
 * @function
 * @returns {array}
 */
export const getStages = async () => {
  const response = await fetch('/api/stages')
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * POST `/api/values`<br/>
 * Retrieves a value list, which is a long list of valus for some dropdown fields.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} payload
 * pushed data
 * @arg {string} payload.instanceId
 * ID of the instance which calls for the value list
 * @arg {string} payload.valueListName
 * name of the value list 
 * @returns {array}
 */
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


/*
** File Handling
*/

/**
 * * POST `/api/upload`
 * * POST `/api/upload/{parentId}/{fileType}`
 *
 * Uploads a file to PoLZy system.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} parentId
 * ID of the instance which uploads the file.
 * Use _null_ or _undefined_ to upload a file which is not related to a PoLZy instance.
 * @arg {string} fileType
 * type of the file to be uploaded
 * @arg {blob} file
 * the file to be uploaded
 */
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

/**
 * GET `/api/documents/{fileId}`<br/>
 * Retrieves a file from PoLZy system.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} fileId
 * ID of the file to be retrieved
 * @returns {string}
 * object URL of the retrieved file
 */
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

/**
 * POST `/api/documents/{fileId}`<br/>
 * Edit the type of a file within PoLZy system by ID.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} fileId
 * ID of the file to be edited
 * @arg {string} fileType
 * a new type of the file
 */
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

  if (!response.ok) {
    throw new Error(response.statusText)
  }
}

/**
 * DELETE `/api/documents/{fileId}`<br/>
 * Delete a file from PoLZy system by ID.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} fileId
 * ID of the file to be deleted
 */
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

/**
 * GET `/{uri}`<br/>
 * Retrieves a resource from PoLZy system by URL.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} uri
 * URL of a resource within PoLZy system to be retrieved
 * @returns {string}
 * object URL of the retrieved resource
 */
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

/**
 * POST `/api/remotedocuments`<br/>
 * Retrieves remote documents from PoLZy system.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} payload
 * request payload
 * @arg {string} payload.parentId
 * ID of the instance which requests the documents
 * @arg {array} payload.documentsId
 * list of IDs of the requested documents
 * @returns {string}
 * object URL of the retrieved document/zipped documents
 */
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

/**
 * POST `/api/generateeml`<br/>
 * Retrieves a *._eml_ file with the remote documents attached.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} payload
 * request payload
 * @arg {string} payload.parentId
 * ID of the instance which requests to generate the *._eml_
 * @arg {array} payload.documentsId
 * list of IDs of the documents attached to the *._eml_
 * @returns {string}
 * object URL of the retrieved *._eml_ file
 */
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

/**
 * POST `/api/generateantrageml`<br/>
 * Retrieves a *._eml_ file with the attached summary of the product offer.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} payload
 * request payload
 * @arg {string} payload.parentId
 * ID of the instance of a product offer which summary should be attached to the *._eml_
 * @returns {string}
 * object URL of the retrieved *._eml_ file
 */
export const getAntragEmail = async (user, payload) => {
  // call api
  console.log(payload)
  const response = await fetch('/api/generateantrageml', {
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