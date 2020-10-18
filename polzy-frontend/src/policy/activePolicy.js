import React from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { 
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
  TextField,
  FormGroup
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CloseIcon from '@material-ui/icons/Close'
import { withTranslation, useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from './policyCardStyles'
import PolicyDetails from './policyDetails'
import { removePolicy } from '../redux/actions'


const ActiveButton = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    backgroundColor: "#00c853",
    '&:hover': {
      backgroundColor: "#43a047",
    }
  },
}))(Button)

const ActiveButtonDisabled = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}))(Button)

const ActionControl = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 240,
  }
}))(FormControl)

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

function PolicyCard(props) {
  const {hidden, content} = props

  return(
    <React.Fragment>
      {hidden ? (
        <CardActiveHide>
          {content}
        </CardActiveHide>
      ) : (
        <CardActive>
          {content}
        </CardActive>
      )}
    </React.Fragment>
  )
}

function MoreButton(props) {
  const classes = useStyles()
  const {t} = useTranslation('policy')

  return(
    <Tooltip title={props.expanded ? (t("collapse")) : (t("expand"))}>
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
    </Tooltip>
  )
}

class ActivePolicy extends React.Component {

  state = {
    expanded: false,
    hidden: false,
    actionIndex: -1,
    actionValues: [],
  }

  actionsNotAvailable = (this.props.policy.policy.possible_activities.length === 0)

  possible_activities = this.props.policy.policy.possible_activities

  handleCloseClick = () => {
    this.setState({
      hidden: true,
      expanded: false,
    })
    setTimeout(() => {this.props.closePolicyCard(this.props.index)}, hideTime)
  }

  handleExpandClick = () => {
    this.setState(state => ({
      expanded: !state.expanded,
    }))
  }

  handleActionChange = (event) => {
    if (event.target.value >= 0) {
      const actionValuesCount = this.possible_activities[event.target.value].fields.length
      this.setState({
        actionIndex: event.target.value,
        actionValues: new Array(actionValuesCount).fill(''),
      })
    } else {
      this.setState({
        actionIndex: -1,
        actionValues: [],
      })
    }
  }

  updateActionValue = (index, value) => {
    this.setState((state) => ({
      actionValues: [
        ...state.actionValues.slice(0, index),
        value,
        ...state.actionValues.slice(index + 1),
      ],
    }))
  }

  validateActivity = () => {
    // check if action selected
    if (this.state.actionIndex === -1)
      return false
    // check action values are filled
    for (let key in this.state.actionValues) {
      if (this.state.actionValues[key] === '')
        return false
    }
    return true
  }

  RenderHeader = (props) => (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Typography
            component="p"
            variant="h5"
          >
            {props.t('policy') + ' #' + this.props.policy.policy.number}
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormGroup row>
            <ActionControl
              variant="outlined"
              size="small"
            >
              <InputLabel id={`action-${this.props.index}-label`}>
                {props.t("action")}
              </InputLabel>
              <Select
                labelId={`action-${this.props.index}-label`}
                id={`action-${this.props.index}`}
                value={this.state.actionIndex}
                onChange={this.handleActionChange}
                disabled={this.actionsNotAvailable}
                label={props.t("action")}
              >
                <MenuItem value={-1}>
                  <em>{props.t("none")}</em>
                </MenuItem>
                {this.possible_activities.map((activity, index) => (
                  <MenuItem value={index}>
                    {activity.name}
                  </MenuItem>
                ))}
              </Select>
            </ActionControl>
            {this.validateActivity() ? (
              <ActiveButton variant="contained" color="primary">
                {props.t("execute")}
              </ActiveButton>
            ) : (
              <ActiveButtonDisabled variant="contained" disabled>
                {props.t("execute")}
              </ActiveButtonDisabled>
            )}
          </FormGroup>
        </Grid>
      </Grid>
    </React.Fragment>
  )


  render(){
    const {t} = this.props

  return(
    <React.Fragment>
      <PolicyCard
        hidden={this.state.hidden}
        content={
          <React.Fragment>
          <CardTop
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
            subheader={this.props.policy.policy.date}
          />
          {this.state.actionIndex === -1 ? ( null ) : (
            <CardContent>
              <Grid container spacing={2}>
                {this.possible_activities[this.state.actionIndex].fields.map((field, index) => (
                    <Grid item key={field.name}>
                      <Tooltip title={field.tooltip}>
                        <TextField
                         label={field.name}
                         variant="outlined"
                         size="small"
                         onChange={(event) => this.updateActionValue(index, event.target.value)}
                         value={this.state.actionValues[index]}
                        />
                      </Tooltip>
                    </Grid>
                ))}
              </Grid>
            </CardContent>
          )}
          <CardBottom>
            <MoreButton expanded={this.state.expanded} onClick={this.handleExpandClick} />
          </CardBottom>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <PolicyDetails policy={this.props.policy.policy} />
            </CardContent>
          </Collapse>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
  }
}

// translation
const TranslatedActivePolicy = withTranslation('policy')(ActivePolicy)

// connect to redux store
export default connect(null, {closePolicyCard: removePolicy})(TranslatedActivePolicy)
