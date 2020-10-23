
//action types
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export const ADD_POLICY = 'ADD_POLICY'
export const UPDATE_POLICY = 'UPDATE_POLICY'
export const REMOVE_POLICY = 'REMOVE_POLICY'

export const ADD_ANTRAG = 'ADD_ANTRAG'
export const UPDATE_ANTRAG = 'UPDATE_ANTRAG'
export const REMOVE_ANTRAG = 'REMOVE_ANTRAG'

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

export const updatePolicy = (index, updateData) => ({
  type: UPDATE_POLICY,
  payload: updateData,
  id: index,
})

export const removePolicy = (index) => ({
  type: REMOVE_POLICY,
  payload: index,
})

// antrag actions
export const newAntrag = (data) => ({
  type: ADD_ANTRAG,
  payload: data,
})

export const updateAntrag = (index, data) => ({
  type: UPDATE_ANTRAG,
  payload: data,
  id: index,
})

export const removeAntrag = (index) => ({
  type: REMOVE_ANTRAG,
  payload: index,
})