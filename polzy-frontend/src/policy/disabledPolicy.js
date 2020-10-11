import React from 'react'
import { Card, CardHeader } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

// Disabled Card Styles
const CardDisabled = withStyles(() => ({
  root: {
    backgroundColor: "#ccc",
  },
}))(Card)

export default function DisabledPolicy(props) {
  const {policy} = props

  return(
    <CardDisabled>
      <CardHeader
        title={"Policy #" + policy.number}
        subheader={policy.date}
      />
    </CardDisabled>
  )
}
