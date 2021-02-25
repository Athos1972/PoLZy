import { combineReducers } from 'redux'
import { 
  SIGN_IN,
  SIGN_OUT,
  UPDATE_USER,
  
  ADD_POLICY,
  UPDATE_POLICY,
  REMOVE_POLICY,
  CLEAR_POLICY,
  
  ADD_ANTRAG,
  UPDATE_ANTRAG,
  REMOVE_ANTRAG,
  CLEAR_ANTRAG,
  
  UPDATE_ADDRESS,
  CLEAR_ADDRESS,

  ADD_VALUES,
  CLEAR_VALUES,
} from './actions.js'

/*
** USER
*/
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGN_IN:
      return action.payload
    case SIGN_OUT:
      return {}
    case UPDATE_USER:
      return {
        ...state,
        badges: [...action.payload],
      }
    default:
      return state
  }
}


/*
** POLICY
*/
const policyReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_POLICY:
      const key = (
        state.length > 0 ? (state[state.length-1].key + 1) : (1)
      )
      return [...state, {key: key, ...action.payload}]
    case UPDATE_POLICY:
      const newState =  state.map((item, index) => (
        index === action.id ? { 
          ...action.payload,
          key: item.key,
        } : item
      ))
      return newState
    case REMOVE_POLICY:
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1)
      ]
    case CLEAR_POLICY:
      return []
    default:
      return state
  }
}

/*
** ANTRAG
*/
const antragReducer = (state = [], action) => {
  switch (action.type) {
    
    // Add New Antrag
    case ADD_ANTRAG:
      const key = (
        state.length > 0 ? (state[state.length-1].key + 1) : (1)
      )
      return [...state, {key: key, ...action.payload}]
    
    // Update Antrag from
    case UPDATE_ANTRAG:
      const newState =  state.map((item, index) => (
        index === action.id ? {
          ...item,
          ...action.payload,
        } : item
      ))
      return newState    
    case REMOVE_ANTRAG:
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1)
      ]
    case CLEAR_ANTRAG:
      return []
    default:
      return state
  }
}

/*
** ADDRESS
*/
const addressReducer = (state={}, action) => {
  switch (action.type) {
    
    // update address
    case UPDATE_ADDRESS:
      const targetAddressList = action.id in state ? state[action.id] : {}
      return {
        ...state,
        [action.id]: {
          ...targetAddressList,
          ...action.payload,
        }
      }

    // clear addresses
    case CLEAR_ADDRESS:
      return {
        ...state,
        [action.id]: undefined,
      }

    // DEFAULT
    default:
      return state
  }
}

/*
** VALUE LIST
*/
const valueReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_VALUES:
      const {name, values} = action.payload
      return {
        ...state,
        [name]: values,
      }
    case CLEAR_VALUES:
      return {}
    default:
      return state
  }
}

const reducer = combineReducers({
  user: userReducer,
  policies: policyReducer,
  antrags: antragReducer,
  addressList: addressReducer,
  valueLists: valueReducer,
})

export default reducer
