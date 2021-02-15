
//action types
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const UPDATE_USER = 'UPDATE_USER'

export const ADD_POLICY = 'ADD_POLICY'
export const UPDATE_POLICY = 'UPDATE_POLICY'
export const REMOVE_POLICY = 'REMOVE_POLICY'
export const CLEAR_POLICY = 'CLEAR_POLICY'

export const ADD_ANTRAG = 'ADD_ANTRAG'
export const UPDATE_ANTRAG = 'UPDATE_ANTRAG'
export const REMOVE_ANTRAG = 'REMOVE_ANTRAG'
export const CLEAR_ANTRAG = 'CLEAR_ANTRAG'

export const ADD_VALUES = 'ADD_VALUES'
export const CLEAR_VALUES = 'CLEAR_VALUES'

// auth actions
export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user,
})

export const signOut = () => ({
  type: SIGN_OUT,
  payload: {},
})

export const updateUser = (updateData) => ({
  type: UPDATE_USER,
  payload: updateData,
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

export const clearPolicy = () => ({
  type: CLEAR_POLICY,
})

// antrag actions
export const addAntrag = (data) => ({
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

export const clearAntrag = () => ({
  type: CLEAR_ANTRAG,
})

// values actions
export const addValues = (payload) => ({
  type: ADD_VALUES,
  payload: payload,
})

export const clearValues = () => ({
  type: CLEAR_VALUES,
})