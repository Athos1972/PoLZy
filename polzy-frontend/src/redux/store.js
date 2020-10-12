import { createStore } from 'redux'
import reducer from './reducer'

// debug imports
import { addPolicy } from './actions'
import { policies } from '../testData/policies'

const store = createStore(reducer)


// debug items

policies.map(item => {
	store.dispatch(addPolicy(item))
})



console.log(store.getState())

export default store 