import React, { useState } from 'react'
import { Provider } from 'react-redux'
import PolzyApp from './polzy'
import store from './redux/store'

export default function App() {

  return(
    <Provider store={store}>
      <PolzyApp />
    </Provider>
  )
}

