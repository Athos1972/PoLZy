import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CircularProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { updatePolicy } from '../redux/actions'
import { fetchPolicy } from '../api'

// Disabled Card Styles
const CardDisabled = withStyles(() => ({
  root: {
    backgroundColor: "#ccc",
  },
}))(Card)

const SpinnerGrey = withStyles(() => ({
  root: {
    color: "#555",
  }
}))(CircularProgress)

function DisabledPolicy(props) {
  const {index, policy} = props
  const { t } = useTranslation('policy')

  useEffect(() => {
    //const data = await fetchPolicy(policy)
    fetchPolicy(policy).then(data => {
      if ('error' in data) {
        props.updatePolicy(
          index,
          {
            status: "failed",
            ...data
          }
        )
      } else if ('policy' in data) {
        props.updatePolicy(
          index,
          {
            status: "ok",
            ...data
          }
        )
      }
    })
    
  })

  return(
    <CardDisabled>
      <CardHeader
        action={<SpinnerGrey />}
        title={t('policy') + ' #' + policy.number}
        subheader={policy.date}
      />
    </CardDisabled>
  )
}

// connect to redux store
export default connect(null, {updatePolicy: updatePolicy})(DisabledPolicy)