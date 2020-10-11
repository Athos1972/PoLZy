import React from 'react'
import { connect } from 'react-redux'
import { Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Header from'../components/header'
import NewPolicy from '../policy/newPolicy'
import DisabledPolicy from '../policy/disabledPolicy'
import ErrorPolicy from '../policy/errorPolicy'
import ActivePolicy from '../policy/activePolicy'
import Copyright from '../components/copyright'

// set styles
const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}));

function PolicyCard(props) {
  const { index, policy } = props
  
  switch (policy.status) {
    case "ok":
      return(
        <ActivePolicy index={index} policy={policy.data} />
      )
    case "waiting":
      return(
        <DisabledPolicy index={index} policy={policy} />
      )
    default:
      return(
        <ErrorPolicy index={index} policy={policy} />
      )
  }
}

function HomeView(props) {
  const classes = useStyles()

  return(
    <React.Fragment>
    <Container maxWidth="lg">
      <Header />
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <NewPolicy />
        </Grid>
        {props.policies.map((policy, index) => (
          <Grid item key={index}>
            <PolicyCard index={index} policy={policy} />
          </Grid>
        ))}
      </Grid>
    </Container>
    <footer className={classes.footer}>
      <Copyright />
    </footer>
    </React.Fragment>
  )
}

// connect to redux store
export default connect((state) => ({
  policies: state.policies,
}))(HomeView)