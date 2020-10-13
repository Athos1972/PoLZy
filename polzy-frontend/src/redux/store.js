import { createStore } from 'redux'
import reducer from './reducer'

// debug imports
import { addPolicy } from './actions'
import { policies } from '../testData/fasifu'

const store = createStore(reducer)


// debug items

policies.map(item => {
	store.dispatch(addPolicy(item))
})


export default store 