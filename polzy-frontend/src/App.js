import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { polzyTheme } from './styles/theme'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'

function App(props) {

  if (props.user.accessToken === undefined) {
    return (
      <ThemeProvider theme={polzyTheme()}>
        <LoginView />
      </ThemeProvider>
    )
  }

  const {attributes} = props.user.company

  return (
    <ThemeProvider theme={polzyTheme(attributes ? attributes.theme : null)}>
      <SnackbarProvider maxSnack={3}>
        <HomeView />
      </SnackbarProvider>
    </ThemeProvider>
  )
}

// connect to redux store
export default connect((state) => ({
  user: state.user,
}))(App)