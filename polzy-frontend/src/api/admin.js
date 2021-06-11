/**
 * Administration Back-End API Calls
 *
 * @category API Calls
 * @module Admin
 */


/**
 * GET `/api/admin`<br/>
 * Retrieve the admin data for the current user
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @returns {object}
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

/**
 * POST `/api/admin/user-company/{action}`<br/>
 * Manage a user within a company
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} action
 * the name of an action to be performed:
 * * _add_ - add a user to a company
 * * _edit_ - edit user's roles in a company
 * * _remove_ - remove a user from a company 
 * @arg {object} payload
 * request details
 * @arg {string} payload.companyId
 * ID of the target company
 * @arg {string} payload.email
 * email of the target user
 * @arg {array} [payload.roles]
 * a list of the roles of the user within the company (required by _add_ and _edit_ actions)
 * @returns {object}
 * the admin data after performing the current action
 */
export const manageUserInCompany = async (user, action, payload) => {
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

/**
 * POST `/api/admin/child-company/{action}`<br/>
 * Manage a child company
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {string} action
 * the name of an action to be performed:
 * * _edit_ - edit child company's attributes
 * * _remove_ - remove a child company
 * @arg {object} payload
 * request details
 * @arg {string} payload.parentCompanyId
 * ID of the parent company
 * @arg {string} payload.childCompanyId
 * ID of the child company
 * @arg {object} [payload.attributes]
 * the attributes of the child company within the parent company (required by _edit_ action)
 * @returns {object}
 * the admin data after performing the current action
 */
export const manageChildCompany = async (user, action, payload) => {
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