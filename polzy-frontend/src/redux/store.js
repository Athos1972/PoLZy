import { createStore } from 'redux'
import reducer from './reducer'

// debug imports
import { addPolicy } from './actions'
import { policies } from '../testData/policies'

const store = createStore(reducer)

policies.map(item => {
	store.dispatch(addPolicy(item))
})
//store.dispatch(addPolicy({status: "failed", number: 'OK-12345', date: '2020-10-10'}))
//store.dispatch(addPolicy({number: 'FL-54321', date: '2020-10-09'}))
//store.dispatch(addPolicy({number: 'WT-00000', date: '2020-10-08'}))

console.log(store.getState())

export default store 