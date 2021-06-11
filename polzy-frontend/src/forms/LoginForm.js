import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button,
  Grid,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../components/languageSelector'
import { getStages } from '../api/general'
import { login } from '../api/auth'
import { validateEmail } from '../utils'


/**
 * Provides a login form that gathers user email, one of the possible stages to work in and lnaguage of the interface.
 *
 * @component
 * @category Auth Forms
 */
function LoginForm(props) {
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
   * @memberOf LoginForm
   * @inner
   */
  const [allStages, setAllStages] = React.useState([])
  /**
   * @name stage
   * @desc State: Currently selected stage.
   * @prop {string} stage - state
   * @prop {function} setStage - setter
   * @type {state}
   * @memberOf LoginForm
   * @inner
   */
  const [stage, setStage] = React.useState(null)
  /**
   * State: Object that holds user's email data
   * @name user
   * @prop {object} user - state
   * @prop {string} user.email - currently entered users's email
   * @prop {string | null} user.error - error mesage associated with the user's email.
   * _null_ if no error occured 
   * @prop {function} setUser - setter
   * @type {state}
   * @memberOf LoginForm
   * @inner
   */
  const [user, setUser] = React.useState({
    email: '',
    error: null,
  })
  
  // call to back-end for possible stages
  /**
   * Calls the back-end ({@link getStages}) for a list of the possible stages, when the component is mounted.
   * If the response is _OK_, the stages are set to state [_allStages_]{@link LoginForm~allStages}.
   *
   * @name useEffect
   * @function
   * @memberOf LoginForm
   * @inner
   */
  React.useEffect(() => {
    getStages().then((data) => {
      setAllStages(data)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  /**
   * Event Handler<br/>
   * **_Event:_** click _submit_ button.<br/>
   * **_Implementation:_** calls back-end [login]{@link module:Auth.login} for user data.
   * If the response is successful then fires [_props.onSubmit_]{@link LoginForm} callback.
   * Otherwise, sets state [_user.error_]{@link LoginForm~user} to the error message received from the back-end.
   */
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

  /**
   * Event Handler<br/>
   * **_Event:_** change user's email<br/>
   * **_Implementation:_** sets entered _email_ string to state [_user.email_]{@link LoginForm~user}.
   * Also validates the  _email_ string.
   * If validation fails then sets message "_Invalid email_" (i18n) to state [_user.error_]{@link LoginForm~user}.
   */
  const handleUserChange = (event) => {
    const errorMsg = validateEmail(event.target.value) ? null : t("auth:user.invalid")
    setUser({
      email: event.target.value,
      error: errorMsg,
    })
  }

  
  /**
   * Checks if the entered email is valid and a stage selected.
   * Enables the submition button if the form is valid.
   *
   * @function
   */
  const validateForm = () => {   
    return validateEmail(user.email) && Boolean(stage)
  }

  return(
    <React.Fragment>
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
    </React.Fragment>
  )
}

LoginForm.propTypes = {
  /**
   * Callback fired when the submit button is clicked.
   */
  onSubmit: PropTypes.func.isRequired,
}

export default LoginForm