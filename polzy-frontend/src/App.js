import React, { useState } from 'react'
import { connect } from 'react-redux'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'

function App(props) {

  return(
    <React.Fragment>
      {props.user['access_token'] === undefined ? (
        <LoginView />
      ) : (
        <HomeView />
      )}
    </React.Fragment>
  )
}

// connect to redux store
export default connect((state) => ({
  user: state.user,
}))(App)