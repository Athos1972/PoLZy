import React from 'react'
import { Card, CardHeader, CardActions, CardContent, Collapse, Button, IconButton, Tooltip } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CloseIcon from '@material-ui/icons/Close'
import clsx from 'clsx'
import PolicyDetails from './policyDetails'

// Active Card Styles
const CardHeaderActive = withStyles((theme) => ({
  root: {
    paddingBottom: 0,
  },
}))(CardHeader)

const CardActionsActive = withStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}))(CardActions)

// Expand Button Styles
const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },

  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))

export default function ActivePolicy(props) {

  const { policy, possible_activities, attributes } = props.policy
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  return(
    <Card>
      <CardHeaderActive
        action={
          <Tooltip title="Close">
            <IconButton aria-label="close">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        }
        title={"Policy #" + policy.number}
        subheader={policy.effective_date}
      />
      <CardActionsActive>
        <Tooltip title={expanded ? ("Collapse") : ("Expand")}>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="view details"
          >
            <ExpandMoreIcon />
          </IconButton>
          </Tooltip>
      </CardActionsActive>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <PolicyDetails policy={policy} />
        </CardContent>
        <CardActions>
          {possible_activities.map((activity) => (
            <Button key={activity} size="small" color="primary">
              {activity}
          </Button>
          ))}
        </CardActions>
      </Collapse>
    </Card>
  )
}
