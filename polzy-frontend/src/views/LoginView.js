import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  Container,
  Button,
  Grid,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { EmblemLogo } from '../components/logo'
import Copyright from '../components/copyright'
import LanguageSelector from '../components/languageSelector'
import { signIn } from '../redux/actions'
import { getStages } from '../api/general'
import { login, getPermissions } from '../api/auth'
import { validateEmail } from '../utils'

// styles
const useStyles = makeStyles({
  loginForm: {
    paddingTop: 60,
    paddingBottom: 30,
  },
})


/**
 * Provides a login form that gathers user email, one of the possible stages to work in and lnaguage of the interface.
 *
 * @component
 * @category Views
 * @subcategory Auth Views
 */
function LoginView(props) {
  const classes = useStyles()
  const {t, i18n} = useTranslation('auth')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * @name allStages
   * @desc State: Array of strings that represent possible **_PoLZy_** stages.
   * @prop {array} allStages - state
   * @prop {function} setAllStages - setter
   * @type {state}
   * @memberOf LoginView
   * @inner
   */
  const [allStages, setAllStages] = useState([])
  /**
   * @name stage
   * @desc State: Currently selected stage.
   * @prop {string} stage - state
   * @prop {function} setStage - setter
   * @type {state}
   * @memberOf LoginView
   * @inner
   */
  const [stage, setStage] = useState(null)
  /**
   * State: Object that holds user's email data
   * @name user
   * @prop {object} user - state
   * @prop {string} user.email - currently entered users's email
   * @prop {string | null} user.error - error mesage associated with the user's email.
   * _null_ if no error occured 
   * @prop {function} setUser - setter
   * @type {state}
   * @memberOf LoginView
   * @inner
   */
  const [user, setUser] = useState({
    email: '',
    error: null,
  })
  
  // call to back-end for possible stages
  /**
   * Calls the back-end ({@link getStages}) for a list of the possible stages, when the component is mounted.
   * If the response is _OK_, the stages are set to state _{@link LoginView~allStages}_.
   *
   * @name useEffect
   * @function
   * @memberOf LoginView
   * @inner
   */
  useEffect(() => {
    getStages().then((data) => {
      setAllStages(data)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const handleLogin = () => {
    login(
      user.email,
      stage,
      i18n.language,
    ).then((userData) => {
      props.onSubmit(userData)
    }).catch((error) => {
      setUser(prevUser => ({
        ...prevUser,
        error: error.message,
      }))
    })
  }

  const handleUserChange = (event) => {
    const errorMsg = validateEmail(event.target.value) ? null : t("auth:user.invalid")
    setUser({
      email: event.target.value,
      error: errorMsg,
    })
  }

  
  /**
   * Checks if the entered email is valid and a stage selected.
   * Enables the submit button enables if the form is valid.
   *
   * @function
   */
  const validateForm = () => {   
    // check if email is valid and stage is set
    return validateEmail(user.email) && Boolean(stage)
  }

  return(
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
        <Grid item xs={12}>
          <TextField
            id="user"
            required
            fullWidth
            label={t("user")}
            error={user.error !== null}
            value={user.email}
            onChange={handleUserChange}
            helperText={user.error}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            id="stage"
            value={stage}
            onChange={(e, v) => setStage(v)}
            options={allStages}
            fullWidth
            size="small"
            renderInput={(params) => 
              <TextField {...params}
                label={t("auth:stage")}
                variant="outlined"
                required
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <LanguageSelector withLabel />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={!validateForm()}
          >
           	{t('auth:signin.button')}
          </Button>
        </Grid>
      </Grid>
      <Copyright />
    </Container>
  )
}

LoginView.propTypes = {
  /**
   * Callback fired when the submit button is clicked.
   */
  onSubmit: PropTypes.func,
}


/*
** Company Select View
*/
function CompanySelectView(props) {
  
  const {t} = useTranslation('auth')
  const classes = useStyles()

  const [company, setCompany] = useState(null)

  const handleCompanyChange = (event, value) => {
    setCompany(value)
  }

  const handleCompanySelect = () => {
    getPermissions(props.user, company).then(permissions => {
      props.onSubmit(permissions)
    }).catch((error) => {
      console.log(error)
    })
  }

  const validateForm = () => {
    return Boolean(company)
  }

  return(
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
        <Grid item xs={12}>
          <Autocomplete
            id="company-select"
            fullWidth
            value={company}
            onChange={handleCompanyChange}
            options={props.user.companies}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            size="small"
            renderInput={(params) => 
              <TextField {...params}
                label={t("auth:company")}
                variant="outlined"
                required
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCompanySelect}
            disabled={!validateForm()}
          >
            {t('auth:submit.company')}
          </Button>
        </Grid>
      </Grid>
      <Copyright />
    </Container>
  )
}

CompanySelectView.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func,
}


/*
** Login View
*/
function AuthView(props) {
  const history = useHistory()
  const location = useLocation()

  const [user, setUser] = useState(null)

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
    <React.Fragment>
      {user === null ? (
        <LoginView onSubmit={handleAuthentication} />
      ) : (
        <CompanySelectView
          user={user}
          onSubmit={handleLogin}
        />
      )}
    </React.Fragment>
  )

}

AuthView.propTypes = {
  signIn: PropTypes.func,
}

// connect to redux store
const mapDispatchToProps = {
  signIn: signIn,
}

export default connect(null, mapDispatchToProps)(AuthView)