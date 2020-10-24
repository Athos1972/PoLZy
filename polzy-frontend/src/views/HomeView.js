import React from 'react'
import { connect } from 'react-redux'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Header from'../components/header'
import NewPolicy from '../policy/newPolicy'
import DisabledPolicy from '../policy/disabledPolicy'
import ErrorPolicy from '../policy/errorPolicy'
import ActivePolicy from '../policy/activePolicy'
import DisabledAntrag from '../antrag/disabled'
import ErrorAntrag from '../antrag/error'
import ActiveAntrag from '../antrag/active'
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

function AntragCard(props) {
  const { index, antrag } = props

  console.log(`ANTRAG-${index}: ${antrag.request_state}`)
  
  switch (antrag.request_state) {
    case "ok":
      return(
        <ActiveAntrag index={index} antrag={antrag} />
      )
    case "waiting":
      return(
        <DisabledAntrag index={index} antrag={antrag} />
      )
    default:
      return(
        <ErrorAntrag index={index} antrag={antrag} />
      )
  }
}

function PolicyCard(props) {
  const { index, policy } = props
  
  switch (policy.request_state) {
    case "ok":
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
  console.log('Home View')
  console.log(props.antrags)

  return(
    <React.Fragment>
    <Container maxWidth="lg">
      <Header />
      <div className={classes.container}>
        <NewPolicy />
        {/* antrag cards */
        props.antrags.map((antrag, index) => (
          <AntragCard key={`antrag-${antrag.key}`} index={index} antrag={antrag} />
        ))}
        {props.policies.map((policy, index) => (
          <PolicyCard key={`policy-${policy.key}`} index={index} policy={policy} />
        ))}
      </div>
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
  antrags: state.antrags,
}))(HomeView)