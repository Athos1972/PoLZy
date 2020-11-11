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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  CircularProgress
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CloseIcon from '@material-ui/icons/Close'
import { withTranslation, useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from '../styles/cards'
import { PolicyTitle } from './Components'
import PolicyDetails from './policyDetails'
import { removePolicy, updatePolicy } from '../redux/actions'
import { executeActivity } from '../api'


const ActiveButton = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    /*backgroundColor: "#00c853",
    '&:hover': {
      backgroundColor: "#43a047",
    }*/
  },
}))(Button)

const ActiveButtonDisabled = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}))(Button)

const progressSize = 30
const ActivityProgress = withStyles((theme) => ({
  root: {
    color: "#00c853",
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -(progressSize + theme.spacing(1)) / 2,
    marginLeft: -progressSize/2,
  }
}))(CircularProgress)

const ActionControl = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 240,
  }
}))(FormControl)

const ValueControl = withStyles((theme) => ({
  root: {
    width: "100%",
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
  const {t} = useTranslation('common')

  return(
    <Tooltip title={props.expanded ? (t("common:collapse")) : (t("common:expand"))}>
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
    actionExecution: false,
    actionIndex: -1,
    actionValues: [],
  }

  actionsNotAvailable = (this.props.policy.possible_activities.length === 0)

  //possible_activities = this.props.policy.possible_activities

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
      const defaultActionValues = this.props.policy.possible_activities[event.target.value].fields.map((field) => (field.valueChosenOrEntered))
      this.setState({
        actionIndex: event.target.value,
        actionValues: defaultActionValues,
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
    console.log('Validate Activity')
    console.log(this.state.actionValues)
    for (let index in this.state.actionValues) {
      console.log(index)
      if (this.props.policy.possible_activities[this.state.actionIndex].fields[index].isMandatory && this.state.actionValues[index] === '')
        return false
    }
    return true
  }

  handleActionExecution = () => {
    console.log('Action Execution')
    this.setState({
      actionExecution: true,
    })

    const executionData = {
      id: this.props.policy.id,
      activity: {
        name: this.props.policy.possible_activities[this.state.actionIndex].name,
        fields: this.props.policy.possible_activities[this.state.actionIndex].fields.map((field, index) => ({
          name: field.name,
          value: this.state.actionValues[index],
        })),
      }
    }

    executeActivity(
      this.props.i18n.language,
      this.props.stage,
      executionData,
    ).then(data => {
      console.log('EXECUTE ACTIVITY RESPONSE')
      console.log(data)
      // update state
      this.setState({
        actionExecution: false,
        actionIndex: -1,
        actionValues: [],
      })
      // update policy data
      this.props.updatePolicy(
        this.props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
    })
  }

  RenderExecutionButton = (props) => (
    <React.Fragment>
    {this.state.actionExecition ? (
      <ActiveButton variant="contained" color="primary" disabled>
        <CircularProgress />
      </ActiveButton>
    ) : (
      <React.Fragment>
      {this.validateActivity() ? (
        <ActiveButton variant="contained" color="primary">
          {props.t("common:execute")}
        </ActiveButton>
      ) : (
        <ActiveButtonDisabled variant="contained" disabled>
          {props.t("common:execute")}
        </ActiveButtonDisabled>
      )}
      </React.Fragment>
    )}
    </React.Fragment>
  )

  RenderHeader = (props) => (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} md={4}>
          <PolicyTitle number={this.props.policy.policy_number} />
        </Grid>
        <Grid item xs={12} md={8}>
          <FormGroup row>
            <ActionControl
              variant="outlined"
              size="small"
            >
              <InputLabel id={`action-${this.props.index}-label`}>
                {props.t("common:action")}
              </InputLabel>
              <Select
                labelId={`action-${this.props.index}-label`}
                id={`action-${this.props.index}`}
                value={this.state.actionIndex}
                onChange={this.handleActionChange}
                disabled={this.actionsNotAvailable}
                label={props.t("common:action")}
              >
                <MenuItem value={-1}>
                  <em>{props.t("common:none")}</em>
                </MenuItem>
                {this.props.policy.possible_activities.map((activity, index) => (
                  <MenuItem key={`${activity.name}-${index}`} value={index}>
                    {activity.name}
                  </MenuItem>
                ))}
              </Select>
            </ActionControl>
            <div style={{position: "relative"}}>
              <ActiveButton 
                variant="contained"
                color="primary"
                onClick={this.handleActionExecution}
                disabled={!this.validateActivity() || this.state.actionExecution}
              >
                {props.t("common:execute")}
              </ActiveButton>
              {this.state.actionExecution && <ActivityProgress size={progressSize} />}
            </div>
          </FormGroup>
        </Grid>
      </Grid>
    </React.Fragment>
  )

  RenderActivityField = (props) => (
    <React.Fragment>
    <Tooltip
      title={props.data.tooltip}
      placement="top"
    >
      {props.data.inputRange.length > 0 ? (
        <ValueControl
          variant="outlined"
          size="small"
          required={props.data.isMandatory}
        >
          <InputLabel id={`${props.data.name}-${this.props.index}-label`}>
            {props.data.name}
          </InputLabel>
          <Select
            labelId={`${props.data.name}-${this.props.index}-label`}
            id={`${props.data.name}-${this.props.index}`}
            value={this.state.actionValues[props.index]}
            onChange={(event) => this.updateActionValue(props.index, event.target.value)}
            label={props.data.name}
          >
            {props.data.inputRange.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </ValueControl>
      ) : (
          <TextField
            label={props.data.name}
            variant="outlined"
            size="small"
            onChange={(event) => this.updateActionValue(props.index, event.target.value)}
            value={this.state.actionValues[props.index]}
          />
      )}
    </Tooltip>
    </React.Fragment>
  )


  render(){
    const {t} = this.props

    console.log(this.props)

  return(
    <React.Fragment>
      <PolicyCard
        hidden={this.state.hidden}
        content={
          <React.Fragment>
          <CardTop
            action={
              <Tooltip title={t("common:close")}>
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
          {this.state.actionIndex === -1 ? ( null ) : (
            <CardContent>
              <Grid container spacing={2}>
                {this.props.policy.possible_activities[this.state.actionIndex].fields.map((field, index) => (
                    <Grid item key={field.name} xs={12} md={4} lg={3}>
                      <this.RenderActivityField index={index} data={field} />
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
              <PolicyDetails policy={this.props.policy} />
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
const TranslatedActivePolicy = withTranslation('common', 'policy')(ActivePolicy)

// connect to redux store
const mapStateToProps = (state) => ({
  stage: state.user.stage,
})

const mapDispatchToProps = {
  closePolicyCard: removePolicy,
  updatePolicy: updatePolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatedActivePolicy)
