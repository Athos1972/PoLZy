import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Container, Button, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import Brand from '../components/brandLogo'
import Copyright from '../components/copyright'
import { signIn } from '../redux/actions'
import { getStages } from '../api'

// styles
const useStyles = makeStyles({
  container: {
    paddingTop: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  stages: {
    width: "100%",
  },

  button: {
    backgroundColor: "#00c853",
    padding: 10,
    marginTop: 10,
    marginBottom: 30,
    '&:hover': {
      backgroundColor: "#43a047",
    }
  },
})


// login view
function LoginView(props) {
  
  const { t } = useTranslation('auth')
  const [stage, setStage] = useState('')
  const [allStages, setAllStages] = useState([])

  useEffect(() => {
    getStages().then((data) => {
      setAllStages(data)
    })
  }, [])

  const handleLogin = () => {
    props.signIn({
      username: "Admin",
      access_token: "12345",
      stage: stage,
    })

  }

  const classes = useStyles()

  return(
    <React.Fragment>
      <Container maxWidth='xs'>
        <div className={classes.container}>
          <Brand size={400} marginBottom={40} />
          <FormControl
            className={classes.stages}
            variant="outlined"
            size="small"
          >
            <InputLabel id="stages-label">
              {t("stage")}
            </InputLabel>
            <Select
              labelId="stages-label"
              id="stages"
              value={stage}
              onChange={(event) => {setStage(event.target.value)}}
              label={t("stage")}
            >
              {allStages.map((stage, index) => (
                <MenuItem key={index} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            classes={{root: classes.button}}
          	variant="contained"
            color="primary"
            fullWidth
          	onClick={handleLogin}
            disabled={stage == null}
          >
         		{t('auth:signin.button')}
          </Button>
          <Copyright />
        </div>
      </Container>
    </React.Fragment>
  )
}

// connect to redux store
export default connect(null, {signIn: signIn})(LoginView)
