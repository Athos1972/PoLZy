/**
 * Redux Actions
 *
 * @category Redux
 * @module Actions
 */


/*
** Auth
*/

/**
 * Action type<br/>
 * [signIn]{@link module:Actions.signIn}
 * @const {string}
 */
export const SIGN_IN = 'SIGN_IN'
/**
 * Signs in a user by setting its payload to _Redux_ state [user]{@link module:State~user}
 *
 * @function
 * @arg user {object}
 * object of a user to sign in
 */
export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user,
})

/**
 * Action type<br/>
 * [signOut]{@link module:Actions.signOut}
 * @const {string}
 */
export const SIGN_OUT = 'SIGN_OUT'
/**
 * Signs out the current user by setting an empty object _{}_ to
 * _Redux_ state [user]{@link module:State~user}
 *
 * @function
 */
export const signOut = () => ({
  type: SIGN_OUT,
})

/**
 * Action type<br/>
 * [updateUser]{@link module:Actions.updateUser}
 * @const {string}
 */
export const UPDATE_USER = 'UPDATE_USER'
/**
 * Updates prop _badges_ of _Redux_ state [user]{@link module:State~user}
 *
 * @function
 * @arg updateData {array}
 * array of user's badges to update with
 */
export const updateUser = (updateData) => ({
  type: UPDATE_USER,
  payload: updateData,
})


/*
** Policy
*/

/**
 * Action type<br/>
 * [addPolicy]{@link module:Actions.addPolicy}
 * @const {string}
 */
export const ADD_POLICY = 'ADD_POLICY'
/**
 * Adds a new instance of policy to _Redux_ state [policies]{@link module:State~policies}
 *
 * @function
 * @arg data {object}
 * a new instance of policy that will be added
 */
export const addPolicy = (data) => ({
  type: ADD_POLICY,
  payload: data,
})

/**
 * Action type<br/>
 * [updatePolicy]{@link module:Actions.updatePolicy}
 * @const {string}
 */
export const UPDATE_POLICY = 'UPDATE_POLICY'
/**
 * Updates in _Redux_ state [policies]{@link module:State~policies}
 * instance of the policy that located under the specified _index_.
 * 
 *
 * @function
 * @arg index {number}
 * index of the policy to be updated
 * @arg updateData {object}
 * a new instance of the policy which will replace the current policy data
 */
export const updatePolicy = (index, updateData) => ({
  type: UPDATE_POLICY,
  payload: updateData,
  id: index,
})

/**
 * Action type<br/>
 * [removePolicy]{@link module:Actions.removePolicy}
 * @const {string}
 */
export const REMOVE_POLICY = 'REMOVE_POLICY'
/**
 * Removes from _Redux_ state [policies]{@link module:State~policies}
 * instance of the policy that located under the specified _index_
 *
 * @function
 * @arg index {number}
 * index of the policy to be removed
 */
export const removePolicy = (index) => ({
  type: REMOVE_POLICY,
  payload: index,
})

/**
 * Action type<br/>
 * [clearPolicy]{@link module:Actions.clearPolicy}
 * @const {string}
 */
export const CLEAR_POLICY = 'CLEAR_POLICY'
/**
 * Removes from _Redux_ state [policies]{@link module:State~policies} all instances of policy. 
 *
 * @function
 */
export const clearPolicy = () => ({
  type: CLEAR_POLICY,
})


/*
** Antrag
*/

/**
 * Action type<br/>
 * [addAntrag]{@link module:Actions.addAntrag}
 * @const {string}
 */
export const ADD_ANTRAG = 'ADD_ANTRAG'
/**
 * Adds a new instance of product offer to _Redux_ state [antrags]{@link module:State~antrags}
 *
 * @function
 * @arg data {object}
 * a new instance of product offer that will be added
 */
export const addAntrag = (data) => ({
  type: ADD_ANTRAG,
  payload: data,
})

/**
 * Action type<br/>
 * [updateAntrag]{@link module:Actions.updateAntrag}
 * @const {string}
 */
export const UPDATE_ANTRAG = 'UPDATE_ANTRAG'
/**
 * Updates in _Redux_ state [antrags]{@link module:State~antrags}
 * instance of the product offer that located under the specified _index_.
 * 
 *
 * @function
 * @arg index {number}
 * index of the product offer to be updated
 * @arg updateData {object}
 * object of the product offer which will replace the current instance if the offer
 */
export const updateAntrag = (index, updateData) => ({
  type: UPDATE_ANTRAG,
  payload: updateData,
  id: index,
})

/**
 * Action type<br/>
 * [removeAntrag]{@link module:Actions.removeAntrag}
 * @const {string}
 */
export const REMOVE_ANTRAG = 'REMOVE_ANTRAG'
/**
 * Removes from _Redux_ state [antrags]{@link module:State~antrags}
 * instance of the product offer that located under the specified _index_
 *
 * @function
 * @arg index {number}
 * index of the product offer to be removed
 */
export const removeAntrag = (index) => ({
  type: REMOVE_ANTRAG,
  payload: index,
})

/**
 * Action type<br/>
 * [clearAntrag]{@link module:Actions.clearAntrag}
 * @const {string}
 */
export const CLEAR_ANTRAG = 'CLEAR_ANTRAG'
/**
 * Removes from _Redux_ state [antrags]{@link module:State~antrags} all instances of product offers.
 *
 * @function
 */
export const clearAntrag = () => ({
  type: CLEAR_ANTRAG,
})


/*
** Address List
*/

/**
 * Action type<br/>
 * [updateAddressList]{@link module:Actions.updateAddressList} 
 * @const {string}
 */
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS'
/**
 * Updates in _Redux_ state [addressList]{@link module:State~addressList}
 * list of addresses assigned to the specified instance of policy _or_ antrag
 * by adding the provided address.  
 *
 * @function
 * @arg instanceId {string}
 * ID of the instance to which the given address should be assigned
 * @arg addressDict {object}
 * object of an address to be added
 */
export const updateAddressList = (instanceId, addressDict) => ({
  type: UPDATE_ADDRESS,
  payload: addressDict,
  id: instanceId,
})

/**
 * Action type<br/>
 * [clearAddressList]{@link module:Actions.clearAddressList} 
 * @const {string}
 */
export const CLEAR_ADDRESS = 'CLEAR_ADDRESS'
/**
 * Removes from _Redux_ state [addressList]{@link module:State~addressList}
 * all addresses assigned to the policy _or_ antrag of the given ID
 *
 * @function
 * @arg instanceId
 * ID of a policy _or_ an antrag instance which list of addresses should be removed
 */
export const clearAddressList = (instanceId) => ({
  type: CLEAR_ADDRESS,
  id: instanceId,
})


/*
** Lists of Values
*/

/**
 * Action type<br/>
 * [addValues]{@link module:Actions.addValues} 
 * @const {string}
 */
export const ADD_VALUES = 'ADD_VALUES'
/**
 * Adds (_or_ updates if already exists) to _Redux_ state [valueLists]{@link module:State~valueLists}
 * a list of values defined by the payload.
 *
 * @function
 * @arg payload {object}
 * object that defines a list of values to be added/updated
 * (see [valueLists]{@link module:State~valueLists} for object structure)
 */
export const addValues = (payload) => ({
  type: ADD_VALUES,
  payload: payload,
})

/**
 * Action type<br/>
 * [clearValues]{@link module:Actions.clearValues} 
 * @const {string}
 */
export const CLEAR_VALUES = 'CLEAR_VALUES'
/**
 * Removes from _Redux_ state [valueLists]{@link module:State~valueLists} all instances of lists of values. 
 *
 * @function
 */
export const clearValues = () => ({
  type: CLEAR_VALUES,
})
