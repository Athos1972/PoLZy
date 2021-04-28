import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  Container,
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router-dom'
import { EmblemLogo } from '../components/logo'
import Copyright from '../components/copyright'
import { signIn } from '../redux/actions'
import { getPermissions } from '../api/auth'
import LoginForm from '../forms/LoginForm'
import CompanySelectForm from'../forms/CompanySelectForm'

// styles
export const useStyles = makeStyles({
  loginForm: {
    paddingTop: 60,
    paddingBottom: 30,
  },
})


/**
 * It is an authentication view. Its roles are as follow:
 * - manage the current login form
 * - set user to the _redux_ store
 * - redirect user to the home view after the succesfull login
 * Renders {@link LoginForm} if state [_user_]{@link AuthView~user} is `null`.
 * Otherwise, renders {@link CompanySelectView}.
 *
 * @component
 * @category Views
 */
function AuthView(props) {
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles()

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * @name user
   * @desc State: _User_ object to be saved in the _redux_ store.
   * @prop {array} user - state
   * @prop {function} setUser - setter
   * @type {state}
   * @memberOf AuthView
   * @inner
   */
  const [user, setUser] = useState(null)

  /**
   * Callback<br/>
   * **_Fired_** when submitting data in {@link CompanySelectForm}.<br/>
   * **_Implementation:_** calls [_props.singIn_]{@link AuthView} callback to save
   * collected _user credentials_ and _permissions_ to the _redux_ store.
   * Then redirects the user to the home view.<br/>
   * Pushed to prop _onSubmit_ of {@link CompanySelectView}.
   *
   * @arg {object} permissions - object that contains _user permissions_ (depending on the selected company).
   */
  const handleLogin = (permissions) => {
    const {companies, ...otherUser} = user

    props.signIn({
      ...otherUser,
      ...permissions,
    })

    // redirection
    const {from} = location.state || {from: {pathname: "/"}}
    history.replace(from)
  }

  /**
   * Callback<br/>
   * **_Fired_** when submitting data in {@link LoginForm}.<br/>
   * **_Implementation:_** checks the quantity the _companies_ associated with the _user_.
   * If the user assigned to only company then calls [_props.signIn_]{@link AuthView}
   * to push the company permissions and redirects the user to {@link HomeView}. 
   * Otherwise sets the user data to state [_user_]{@link AuthView~user}.<br/>
   * Pushed to prop _onSubmit_ of {@link LoginForm}.
   *
   * @arg {object} userData - object that contains user data
   */
  const handleAuthentication = (userData) => {
    const {companies, ...otherUser} = userData

    // check if user assigned only to one company
    if (companies.length === 1) {
      // get permissions
      getPermissions(otherUser, companies[0]).then(permissions => {
        props.signIn({
          ...otherUser,
          ...permissions,
        })

        // redirection
        const {from} = location.state || {from: {pathname: "/"}}
        history.replace(from)
      }).catch((error) => {
        console.log(error.message)
      })

      return
    }

    // update state
    setUser(userData)
  }

  return (
    <Container maxWidth='xs'>
      <Grid
        classes={{root: classes.loginForm}}
        container
        spacing={2}
      >
        <Grid item xs={12}>
          <EmblemLogo
            size={200}
          />
        </Grid>

      {/* Auth Form */}
        {user === null ? (
          <LoginForm onSubmit={handleAuthentication} />
        ) : (
          <CompanySelectForm
            user={user}
            onSubmit={handleLogin}
          />
        )}
      </Grid>
      <Copyright />
    </Container>
  )
}

AuthView.propTypes = {
  /**
   * _Redux_ action that saves _user_ data to the store
   */
  signIn: PropTypes.func,
}

// connect to redux store
const mapDispatchToProps = {
  signIn: signIn,
}

export default connect(null, mapDispatchToProps)(AuthView)