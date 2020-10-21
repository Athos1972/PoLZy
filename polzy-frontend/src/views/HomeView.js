import React from 'react'
import { connect } from 'react-redux'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Header from'../components/header'
import NewPolicy from '../policy/newPolicy'
import DisabledPolicy from '../policy/disabledPolicy'
import ErrorPolicy from '../policy/errorPolicy'
import ActivePolicy from '../policy/activePolicy'
import Copyright from '../components/copyright'

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}));

function PolicyCard(props) {
  const { index, policy } = props
  
  switch (policy.request_state) {
    case "ok":
      //console.log(policy)
      return(
        <ActivePolicy index={index} policy={policy} />
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
  console.log(props.policies)

  return(
    <React.Fragment>
    <Container maxWidth="lg">
      <Header />
      <div className={classes.container}>
        <NewPolicy />
        {props.policies.map((policy, index) => (
            <PolicyCard key={policy.key} index={index} policy={policy} />
        ))}
      </div>

      {/*<Grid container direction="column">
        <Grid item>
          <NewPolicy />
        </Grid>
        {props.policies.map((policy, index) => (
          <Grid item key={index}>
            <PolicyCard index={index} policy={policy} />
          </Grid>
        ))}
      </Grid>*/}
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