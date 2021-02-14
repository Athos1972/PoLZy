import React, { useState, useEffect } from 'react'
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
import { EmblemLogo } from '../components/logo'
import Copyright from '../components/copyright'
import LanguageSelector from '../components/languageSelector'
import { signIn } from '../redux/actions'
import { getStages } from '../api/general'
import { login, getPermissions } from '../api/auth'

// styles
const useStyles = makeStyles({
  loginForm: {
    paddingTop: 60,
    paddingBottom: 30,
  },
})


/*
** Authentication View
*/
function AuthenticationView(props) {
  const classes = useStyles()
  const {t, i18n} = useTranslation('auth')

  const [stage, setStage] = useState(null)
  const [allStages, setAllStages] = useState([])
  const [user, setUser] = useState({
    email: '',
    error: null,
  })
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

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
      //console.log(error.message)
      setUser(prevUser => ({
        ...prevUser,
        error: error.message,
      }))
    })
  }

  const handleUserChange = (event) => {
    const errorMsg = emailRegex.test(event.target.value) ? null : "Invalid email"
    setUser({
      email: event.target.value,
      error: errorMsg,
    })
  }

  const validateForm = () => {   
    // check if email is valid and stage is set
    return emailRegex.test(user.email) && Boolean(stage)
  }

  //console.log('AUTH VIEW:')
  //console.log(props)

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

  //console.log('COMPANY VIEW:')
  //console.log(props)

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
      {/*
        <Grid item xs={12}>
          <Typography 
            variant="h5"
            component="h2"
            align="center"
          >
            {props.user.email}
          </Typography>
        </Grid>
      */}
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


/*
** Login View
*/
function LoginView(props) {

  const [user, setUser] = useState(null)

  const handleLogin = (permissions) => {
    const {companies, ...otherUser} = user

    props.signIn({
      ...otherUser,
      ...permissions,
    })
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
        <AuthenticationView onSubmit={handleAuthentication} />
      ) : (
        <CompanySelectView
          user={user}
          onSubmit={handleLogin}
        />
      )}
    </React.Fragment>
  )

}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  signIn: signIn,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView)