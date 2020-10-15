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
import { withTranslation } from 'react-i18next'
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

const ActionForm = withStyles({
  root: {
    minWidth: 120,
  }
})(FormControl)

// More Button Styles
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

function MoreButton(props) {
  const classes = useStyles()

  return(
    <IconButton
      className={clsx(classes.expand, {
        [classes.expandOpen]: props.expanded,
      })}
      onClick={props.onClick}
      aria-expanded={props.expanded}
      aria-label="view details"
    >
      <ExpandMoreIcon />
    </IconButton>
  )
}

class ActivePolicy extends React.Component {

  state = {
    expanded: false,
    action: '',
    actionAttributes: {},
  }
  //const { index } = props
  //const { policy, possible_activities, attributes } = this.props.policy
  
  //const [expanded, setExpanded] = React.useState(false);
  //const [action, setAction] = React.useState('')
  actionsNotAvailable = (this.props.policy.possible_activities.length === 0)
  //const [actionAttributes, setActionAttributes] = React.useState({})

  handleCloseClick = () => {
    this.props.closePolicyCard(this.props.index)
  }

  handleExpandClick = () => {
    this.setState(state => ({
      expanded: !state.expanded,
    }))
  }

  handleActionChange = (event) => {
    
    const newActionAttributes = {}
    if (event.target.value !== '') {
      Object.keys(this.props.policy.attributes.policy).forEach(key => {newActionAttributes[key] = ''})
    }
    this.setState({
      action: event.target.value,
      actionAttributes: newActionAttributes,
    })
  }

  updateActionAttribute = (attr, value) => {
    const items = {...this.state.actionAttributes}
    items[attr] = value
    this.setState({
      actionAttributes: items,
    })
  }

  validateActivity = () => {
    // check if action selected
    if (this.state.action === '')
      return false
    // check action attributes are filled
    for (let key in this.state.actionAttributes) {
      if (this.state.actionAttributes[key] === '')
        return false
    }
    return true
  }

  RenderHeader = (props) => (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item>
          <Typography
            component="p"
            variant="h5"
          >
            {props.t('policy') + ' #' + this.props.policy.number}
          </Typography>
        </Grid>
        <Grid item>
          <ActionForm
            variant="outlined"
            size="small"
          >
            <InputLabel id={`action-${this.props.index}-label`}>
              {props.t("action")}
            </InputLabel>
            <Select
              labelId={`action-${this.props.index}-label`}
              id={`action-${this.props.index}`}
              value={this.state.action}
              onChange={this.handleActionChange}
              label={props.t("action")}
              disabled={this.actionsNotAvailable}
            >
              <MenuItem value="">
                <em>{props.t("none")}</em>
              </MenuItem>
              {this.props.policy.possible_activities.map((activity) => (
                <MenuItem value={activity}>
                  {activity}
                </MenuItem>
              ))}
            </Select>
          </ActionForm>
        </Grid>
        <Grid item>
          {this.validateActivity ? (
            <ActiveButton variant="contained" color="primary">
              {props.t("execute")}
            </ActiveButton>
          ) : (
            <Button variant="contained" disabled>
              {props.t("execute")}
            </Button>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  )

  render(){
    const {t} = this.props
  return(
    
    <Card>
      <CardHeaderActive
        action={
          <Tooltip title={t("close")}>
            <IconButton 
              onClick={this.handleCloseClick}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        }
        title={<this.RenderHeader t={t} />}
        subheader={this.props.policy.effective_date}
      />
      <CardContent>
        <Grid container spacing={3}>
          {Object.keys(this.state.actionAttributes).map((attr) => (
              <Grid item key={attr}>
                <Tooltip title={this.props.policy.attributes.policy[attr]}>
                  <TextField
                   label={attr}
                   variant="outlined"
                   size="small"
                   onChange={(event) => this.updateActionAttribute(attr, event.target.value)}
                   value={this.state.actionAttributes[attr]}
                  />
                </Tooltip>
              </Grid>
          ))}
        </Grid>
      </CardContent>
      <CardActionsActive>
        <Tooltip title={this.state.expanded ? (t("collapse")) : (t("expand"))}>
          <MoreButton expanded={this.state.expanded} onClick={this.handleExpandClick} />

        </Tooltip>
      </CardActionsActive>
      <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <PolicyDetails policy={this.props.policy.policy} />
        </CardContent>
      </Collapse>
    </Card>
  )
  }
}

// translation
const TranslatedActivePolicy = withTranslation('policy')(ActivePolicy)

// connect to redux store
export default connect(null, {closePolicyCard: removePolicy})(TranslatedActivePolicy)
