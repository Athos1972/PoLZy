import React from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CardActions, Typography, IconButton, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { removePolicy } from '../redux/actions'


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


function ErrorPolicy(props) {
  const {index, policy} = props

  const handleCloseClick = () => {
    props.closePolicyCard(index)
  } 

  return(
    <CardError>
      <CardErrorHeader
        action={
          <Tooltip title="Close">
            <IconButton 
              aria-label="close"
              onClick={handleCloseClick}
            >
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

// connect to redux store
export default connect(null, {closePolicyCard: removePolicy})(ErrorPolicy)
