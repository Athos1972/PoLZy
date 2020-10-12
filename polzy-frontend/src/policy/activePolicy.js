import React from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { 
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Collapse,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CloseIcon from '@material-ui/icons/Close'
import PolicyDetails from './policyDetails'
import { removePolicy } from '../redux/actions'


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

const ActiveButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#00c853",
    '&:hover': {
      backgroundColor: "#43a047",
    }
  },
}))(Button)

// Active Elements Styles
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

  actionSelect: {
    minWidth: 120,
  },
}))

function ActivePolicy(props) {

  const { index } = props
  const { policy, possible_activities, attributes } = props.policy
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false);
  const [action, setAction] = React.useState('')
  const actionsNotAvailable = (possible_activities.length === 0)
  const [actionAttributes, setActionAttributes] = React.useState({})

  const handleCloseClick = () => {
    props.closePolicyCard(index)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleActionChange = (event) => {
    setAction(event.target.value)
    const newActionAttributes = {}
    if (event.target.value !== '') {
      Object.keys(attributes.policy).forEach(key => {newActionAttributes[key] = ''})
    }
    setActionAttributes(newActionAttributes)
  }

  const updateActionAttribute = (attr, value) => {
    const items = {...actionAttributes}
    items[attr] = value
    setActionAttributes(items)
  }

  const validateActivity = () => {
    // check if action selected
    if (action === '')
      return false
    // check action attributes are filled
    for (let key in actionAttributes) {
      if (actionAttributes[key] === '')
        return false
    }
    return true
  }

  const RenderHeader = () => (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item>
          <Typography
            component="p"
            variant="h5"
          >
            Policy #{policy.number}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl
            className={classes.actionSelect}
            variant="outlined"
            size="small"
          >
            <InputLabel id={`action-${index}-label`}>Action</InputLabel>
            <Select
              labelId={`action-${index}-label`}
              id={`action-${index}`}
              value={action}
              onChange={handleActionChange}
              label="Action"
              disabled={actionsNotAvailable}
            >
              <MenuItem value="">
                <em>none</em>
              </MenuItem>
              {possible_activities.map((activity) => (
                <MenuItem value={activity}>
                  {activity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          {validateActivity() ? (
            <ActiveButton variant="contained" color="primary">
              Execute
            </ActiveButton>
          ) : (
            <Button variant="contained" disabled>
              Execute
            </Button>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )

  return(
    <Card>
      <CardHeaderActive
        action={
          <Tooltip title="Close">
            <IconButton 
              onClick={handleCloseClick}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        }
        title={<RenderHeader />}
        subheader={policy.effective_date}
      />
      <CardContent>
        <Grid container spacing={3}>
          {Object.keys(actionAttributes).map((attr) => (
              <Grid item key={attr}>
                <Tooltip title={attributes.policy[attr]}>
                  <TextField
                   label={attr}
                   variant="outlined"
                   size="small"
                   onChange={(event) => updateActionAttribute(attr, event.target.value)}
                   value={actionAttributes[attr]}
                  />
                </Tooltip>
              </Grid>
          ))}
        </Grid>
      </CardContent>
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
      </Collapse>
    </Card>
  )
}

// connect to redux store
export default connect(null, {closePolicyCard: removePolicy})(ActivePolicy)
