/**
 * Back-End API Calls for Product Offer
 *
 * @category API Calls
 * @module Antrag
 */


/**
 * GET `/api/antrag/products`<br/>
 * Retrieve a list of the possible products
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @returns {array}
 */
export const getProducts = async (user) => {
  const response = await fetch('/api/antrag/products', {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * GET `/api/antrag/new/{productName}`<br/>
 * Retrieve an offer instance of the given product
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} antrag
 * product offer data
 * @arg {string} antrag.product_line.name
 * the name of a product
 * @returns {object}
 * the instance of a product offer
 */
export const fetchAntrag = async (user, antrag) => {
  const response = await fetch(`/api/antrag/new/${antrag.product_line.name}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * GET `/api/antrag/clone/{antragId}`<br/>
 * Retrieve a cloned instance of the given product offer
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} antragId
 * the instance ID of the product offer to be cloned
 * @returns {object}
 * the cloned instance of the product offer 
 */
export const cloneAntrag = async (user, antragId) => {
  const response = await fetch(`/api/antrag/clone/${antragId}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * DELETE `/api/antrag/delete/{antragId}`<br/>
 * Delete the given instance of a product offer
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} antragId
 * the instance ID of the product offer to be deleted
 * @returns {object}
 * the status of the deletion
 */
export const deleteAntrag = async (user, antragId) => {
  const response = await fetch(`/api/antrag/delete/${antragId}`, {
    method: 'DELETE',
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * GET `/api/antrag/records/{antragId}`<br/>
 * Load the instance of a product offer by ID
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} antragId
 * the instance ID of the product offer to be loaded
 * @returns {object}
 * the instance of the product offer
 */
export const loadAntrag = async (user, antragId) => {
  const response = await fetch(`/api/antrag/records/${antragId}`, {
    headers: {'authorization': `Bearer ${user.accessToken}`},
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  const error = new Error(response.statusText)
  error.status = response.status
  throw error
}

/**
 * POST `/api/antrag/update`<br/>
 * Updates the values of the data fields related to the given product offer
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} antrag
 * product offer data
 * @arg {string} antrag.id
 * the instance ID of the product offer to be updated
 * @arg {string} [activity]
 * the name of an activity which holds the data fields to be updated.
 * If not specified, then the data fields of the product instance will be updated.
 * @arg {object} values
 * the data fields (in form `fieldName: fieldValue`) that should be updated
 * @returns {object}
 * the updated instance of the product offer
 */
export const updateAntragFields = async (user, antrag) => {
  const response = await fetch(`/api/antrag/update`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(antrag),
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * POST `/api/antrag/execute`<br/>
 * Execute an activity of the given product offer
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} antrag
 * product offer data
 * @arg {string} antrag.id
 * the instance ID of the product offer to be processed
 * @arg {string} antrag.activity
 * the name of the activity to be executed
 * @arg {object} [antrag.values]
 * the data fields (in form `fieldName: fieldValue`) that should be updated
 * before executing the activity
 * @returns {object}
 * the instance of the product offer after execution the activity 
 */
export const executeAntrag = async (user, antrag) => {
  const response = await fetch(`/api/antrag/execute`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(antrag),
  })
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * * POST `/api/search`
 * * POST `/api/search/{id}`
 * * POST `/api/antrag/records/search`
 *
 * Execute a search activity
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} [id]
 * the instance ID of the product offer that makes the request
 * (required by some search activities)
 * @arg {string} target
 * the name of a search activity to be executed
 * @arg {string} value
 * the search string
 * @returns {array}
 * the list of the search objects that match the request 
 */
export const searchPortal = async (user, id, target, value) => {
  const searchUri = target === "antrag" ? "/api/antrag/records/search" : (
    id ? `/api/search/${id}`: '/api/search'
  )
  const response = await fetch(searchUri, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      activity: target,
      value: value,
    }),
  })
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)
}

/**
 * POST `/api/antrag/tag/{id}`<br/>
 * Update the custom tag of the given product offer
 *
 * DELETE `/api/antrag/tag/{id}`<br/>
 * Removes the custom tag of the given product offer
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} id
 * the instance ID of the product offer that requests the change of the custom tag
 * @arg {object} payload
 * request data
 * @arg {string} payload.action
 * one of the following values:
 * * _set_ - set a new tag
 * * _delete_ - remove the current tag
 * @arg {string} [payload.tag]
 * a new custom tag
 * @returns {object}
 * the status of the custom tag changing
 */
export const setCustomTag = async (user, id, payload) => {
  const deriveMethod = () => {
    switch (payload.action) {
      case 'set':
        return 'POST'
      case 'delete':
        return 'DELETE'
      default:
        throw new Error('Method not supported')
    }
  }

  const fetchAttributes = {
    method: deriveMethod(),
    headers: {
      'authorization': `Bearer ${user.accessToken}`,
      'content-type': 'application/json',
    },
  }

  if (fetchAttributes.method === 'POST') {
    fetchAttributes.body = JSON.stringify(payload)
  }

  const response = await fetch(`/api/antrag/tag/${id}`, fetchAttributes)
  const data = await response.json()
  
  if (response.ok) {
    return data
  }

  throw new Error(data.error)

}