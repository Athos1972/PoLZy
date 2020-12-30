import { combineReducers } from 'redux'
import { 
  SIGN_IN,
  SIGN_OUT,
  ADD_POLICY,
  UPDATE_POLICY,
  REMOVE_POLICY,
  CLEAR_POLICY,
  ADD_ANTRAG,
  UPDATE_ANTRAG,
  REMOVE_ANTRAG,
  CLEAR_ANTRAG,
} from './actions.js'


const userReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGN_IN:
      return action.payload
    case SIGN_OUT:
      return {}
    default:
      return state
  }
}


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

const antragReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_ANTRAG:
      const key = (
        state.length > 0 ? (state[state.length-1].key + 1) : (1)
      )
      return [...state, {key: key, ...action.payload}]
    case UPDATE_ANTRAG:
      const newState =  state.map((item, index) => (
        index === action.id ? { 
          ...action.payload,
          key: item.key,
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

const reducer = combineReducers({
  user: userReducer,
  policies: policyReducer,
  antrags: antragReducer,
})

export default reducer
