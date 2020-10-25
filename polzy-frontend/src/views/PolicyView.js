import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import NewPolicy from '../policy/newPolicy'
import DisabledPolicy from '../policy/disabledPolicy'
import ErrorPolicy from '../policy/errorPolicy'
import ActivePolicy from '../policy/activePolicy'

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

}));

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

function PolicyView(props) {
  const classes = useStyles()

  return(
    <div className={classes.container}>
      <NewPolicy />
      {props.policies.map((policy, index) => (
        <PolicyCard key={policy.key} index={index} policy={policy} />
      ))}
    </div>
  )
}

// connect to redux store
export default connect((state) => ({
  policies: state.policies,
}))(PolicyView)