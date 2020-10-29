import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { CardDisabled, CardTop, CardMiddle } from '../styles/cards'
import { PolicyTitle } from './Components'
import { updatePolicy } from '../redux/actions'
import { fetchPolicy } from '../api'

const WaitingProgress = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  }
}))(LinearProgress)

function DisabledPolicy(props) {
  const {index, policy} = props

  useEffect(() => {
    //const data = await fetchPolicy(policy)
    fetchPolicy(policy).then(data => {
      console.log('POLICY RESPONSE:')
      console.log(data)
      if ('error' in data) {
        props.updatePolicy(
          index,
          {
            ...policy,
            request_state: "failed",
            ...data,
          }
        )
      } else if ('id' in data) {
        props.updatePolicy(
          index,
          {
            request_state: "ok",
            ...data,
          }
        )
      }
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
export default connect(null, {updatePolicy: updatePolicy})(DisabledPolicy)