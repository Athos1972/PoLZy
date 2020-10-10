import React from 'react'
import { Container, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Brand from '../components/brand'
import Copyright from '../components/copyright'

export default function LoginView(props) {
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
          	onClick={props.auth}
          >
         		Press to Login
          </Button>
          <Copyright />
        </div>
      </Container>
    </React.Fragment>
  )
}

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