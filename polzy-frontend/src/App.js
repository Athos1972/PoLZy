import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { themeGreenOrange } from './styles/theme'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'

function App(props) {

  return(
    <ThemeProvider theme={themeGreenOrange}>
      {props.user['access_token'] === undefined ? (
        <LoginView />
      ) : (
        <HomeView />
      )}
    </ThemeProvider>
  )
}

// connect to redux store
export default connect((state) => ({
  user: state.user,
}))(App)