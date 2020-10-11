
//action types
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export const ADD_POLICY = 'ADD_POLICY'
export const UPDATE_POLICY = 'UPDATE_POLICY'
export const REMOVE_POLICY = 'REMOVE_POLICY'

// auth actions
export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user,
})

export const signOut = () => ({
  type: SIGN_OUT,
  payload: {},
})

// policy actions
export const addPolicy = (newPolicy) => ({
  type: ADD_POLICY,
  payload: newPolicy,
})

export const updatePolicy = (updateData) => ({
  type: UPDATE_POLICY,
  payload: updateData,
})

export const removePolicy = (index) => ({
  type: REMOVE_POLICY,
  payload: index,
})