/**
 * Back-End API Calls for Authentication & Authorization
 *
 * @category API Calls
 * @module Auth
 */


/**
 * POST `/api/login`<br/>
 * Sign in a user to PoLZy system.
 *
 * @async
 * @function
 * @arg {string} email
 * user's email
 * @arg {string} stage
 * the stage of the current session
 * @arg {string} language
 * the language of the current session
 * @returns {object}
 * the current user's data
 */
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
/**
 * POST `/api/permissions`<br/>
 * Retrieves the current user's permissions.
 *
 * @async
 * @function
 * @arg {object} user
 * the current user's data
 * @arg {string} user.accessToken
 * the current user's access token
 * @arg {object} company
 * the current company's data
 * @arg {string} company.id
 * ID of the current company
 * @returns {object}
 * user's permissions within the current company
 */
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