import { createStore } from 'redux'
import reducer from './reducer'

// debug imports

//import { addPolicy, addAntrag } from './actions'
//import { policies } from '../testData/fasifu'
//import { antrags } from '../testData/antrag'

const store = createStore(reducer)


/*
** DEBUG ITEMS
*/
/*
// policies
policies.map(item => {
	store.dispatch(addPolicy(item))
})

// antrags
antrags.map(item => {
	store.dispatch(addAntrag(item))
})

// antrags duplicate
antrags.map(item => {
	store.dispatch(addAntrag({...item, id: "42118db7-f92a-4ec4-9513-df7d2f4bf751"}))
})
console.log(store.getState())
*/

export default store 