import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { polzyTheme } from './styles/theme'
import LoginView from './views/LoginView'
import MainView from './views/MainView'


function PrivateRouteBase({ user, children, ...other }) {

  return (
    <Route
      {...other}
      render={({ location }) =>
        user.accessToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function App(props) {
  const {user} = props

  const companyTheme = (user.company && user.company.attributes) ? user.company.attributes.theme : undefined

  return (
    <ThemeProvider theme={polzyTheme(companyTheme)}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Switch>
            
            {/* Log in */}
            <Route path="/login">
              <LoginView />
            </Route>

            {/* Antrag Tab */}
            <PrivateRoute path="/antrag">
              <MainView tab="antrag" />
            </PrivateRoute>
            
            {/* Policy Tab */}
            <PrivateRoute path="/">
              <MainView />
            </PrivateRoute>
          
          </Switch>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}


// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const PrivateRoute = connect(mapStateToProps)(PrivateRouteBase)

// connect to redux store
export default connect(mapStateToProps)(App)