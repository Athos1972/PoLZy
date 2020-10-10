import React from 'react'
import { Grid, Card, CardHeader, CardActions, CardContent, Collapse, Typography, Button, IconButton } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import PolicyDetails from './policyDetails'

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
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }
        title={"Policy #" + policy.number}
        subheader={policy.effective_date}
      />
      <CardActionsActive>
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

const useStyles = makeStyles((theme) => ({

  value: {
    color: "#555",
  },

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