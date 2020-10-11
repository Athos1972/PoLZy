import React from 'react'
import { Card, CardHeader, CardActions, Typography, IconButton, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

// Error Card Styles
const CardError = withStyles(() => ({
  root: {
    backgroundColor: "#fbb",
    color: "#b71c1c",
  },
}))(Card)

const CardErrorHeader = withStyles(() => ({
  root: {
    paddingBottom: 0,
  },
}))(CardHeader)

const CardErrorContent = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingTop: 0,
  },
}))(CardActions)


export default function ErrorPolicy(props) {
  const {policy} = props

  return(
    <CardError>
      <CardErrorHeader
        action={
          <Tooltip title="Close">
            <IconButton aria-label="close">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        }
        title={"Policy #" + policy.number}
        subheader={policy.date}
      />
      <CardErrorContent>
        <Typography
          component="p"
          variant="h5"
        >
          {policy.status === "failed" ? ("Policy Not Found") : ("Invalid Response Status")}
        </Typography>
      </CardErrorContent>
    </CardError>
  )
}
