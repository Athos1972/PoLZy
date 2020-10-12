import React from 'react'
import { connect } from 'react-redux'
import { Container, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Brand from '../components/brand'
import Copyright from '../components/copyright'
import { signIn } from '../redux/actions'

// styles
const useStyles = makeStyles({
  container: {
    paddingTop: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#00c853",
    padding: 10,
    margin: 30,
    '&:hover': {
      backgroundColor: "#43a047",
    }
  },
})


// login view
function LoginView(props) {

  const handleLogin = () => {
    props.signIn({
      username: "Admin",
      access_token: "12345",
    })

  }

  const classes = useStyles()

  return(
    <React.Fragment>
      <Container maxWidth='xs'>
        <div className={classes.container}>
          <Brand fontSize={60} marginBottom={40} />
          <Button
            classes={{root: classes.button}}
          	variant="contained"
            color="primary"
            fullWidth
          	onClick={handleLogin}
          >
         		Press to Login
          </Button>
          <Copyright />
        </div>
      </Container>
    </React.Fragment>
  )
}

// connect to redux store
export default connect(null, {signIn: signIn})(LoginView)
