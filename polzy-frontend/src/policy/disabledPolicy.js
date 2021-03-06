import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { CardDisabled, CardTop, CardMiddle } from '../styles/cards'
import { PolicyTitle } from './Components'
import { updatePolicy } from '../redux/actions'
import { fetchPolicy } from '../api/policy'

const WaitingProgress = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  }
}))(LinearProgress)

function DisabledPolicy(props) {
  const {index, policy} = props

  useEffect(() => {
    //fetch policy data on mount
    fetchPolicy(props.user, policy).then(data => {
      props.updatePolicy(
        index,
        {
          request_state: "ok",
          ...data,
        }
      )
    }).catch(error => {
      console.log(error)
      props.updatePolicy(
        index,
        {
          ...policy,
          request_state: "failed",
          error: error.message,
        }
      )
    })  
  })

  return(
    <CardDisabled>
      <CardTop
        title={<PolicyTitle number={policy.policy_number} />}
        subheader={policy.effective_date}
      />
      <CardMiddle>
        <WaitingProgress />
      </CardMiddle>
    </CardDisabled>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  updatePolicy: updatePolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisabledPolicy)