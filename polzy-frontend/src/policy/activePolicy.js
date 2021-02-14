import React from 'react'
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
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { withTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from '../styles/cards'
import { PolicyTitle } from './Components'
import PolicyDetails from './policyDetails'
import { removePolicy, updatePolicy } from '../redux/actions'
import { executeActivity } from '../api/policy'
import ExpandButton from '../components/expandButton'
import DataGroup from '../datafields/generalFields'
import ProgressButton from '../components/progressButton'
// test imports
import {BrokeCard} from '../debug/damageCard'



const ActiveButton = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
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
    width: 240,
  }
}))(FormControl)

const ValueControl = withStyles((theme) => ({
  root: {
    width: "100%",
  }
}))(FormControl)

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

class ActivePolicy extends React.Component {

  state = {
    expanded: false,
    hidden: false,
    activityExecutes: false,
    currentActivity: null,
    activityValues: {},
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

  getActivityByName = (name) => {
    // returns possible activity by its name
    for (const activity of this.props.policy.possible_activities) {
      if (activity.name === name) {
        return activity
      }
    }
    return null
  }

  handleActivityDataChanged = (newValues) => {
    this.setState(prevState => ({
      activityValues: {
        ...prevState.activityValues,
        ...newValues
      }
    }))
  }

  handleActivitySelect = (event) => {
    //console.log('Activity Selected:')
    //console.log(event.target.value)
    if (event.target.value === "none") {
      this.setState({
        currentActivity: null,
        activityValues: {},
      })
      return
    }

    const newActivity = this.getActivityByName(event.target.value)
    //console.log('NEW ACTIVITY:')
    //console.log(newActivity)

    // update state
    this.setState({
      currentActivity: {...newActivity},
      activityValues: newActivity.fields.reduce((result, field) => ({
        ...result,
        [field.name]: field.fieldDataType === "Flag" ? field.valueChosenOrEntered === "True" : (
          field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
        ),
      }), {})
    })
  }

  handleActionChange = (event) => {
    if (event.target.value >= 0) {
      const defaultactivityValues = this.props.policy.possible_activities[event.target.value].fields.map((field) => (field.valueChosenOrEntered))
      this.setState({
        actionIndex: event.target.value,
        activityValues: defaultactivityValues,
      })
    } else {
      this.setState({
        actionIndex: -1,
        activityValues: [],
      })
    }
  }

  updateActionValue = (index, value) => {
    this.setState((state) => ({
      activityValues: [
        ...state.activityValues.slice(0, index),
        value,
        ...state.activityValues.slice(index + 1),
      ],
    }))
  }

  validateActivity = () => {
    // check if activity selected
    if (this.state.currentActivity === null)
      return false

    // check activity values are filled
    //console.log('Validate Activity')
    //console.log(this.state.activityValues)
    for (const field of this.state.currentActivity.fields) {
        //console.log(`${field.isMandatory ? "+" : "-"} ${field.name}: ${values[field.name]}`)
        if (field.isMandatory && (this.state.activityValues[field.name] === "" || this.state.activityValues[field.name] === null))
          return false
      }
  /*      
    for (let index in this.state.activityValues) {
      console.log(index)
      if (this.props.policy.possible_activities[this.state.actionIndex].fields[index].isMandatory && this.state.activityValues[index] === '')
        return false
    }
  */
    return true
  }

  handleActivityExecution = () => {
    //console.log('Action Execution')
    this.setState({
      activityExecutes: true,
    })

    const requestData = {
      id: this.props.policy.id,
      activity: {
        name: this.state.currentActivity.name,
        fields: this.state.currentActivity.fields.map((field) => ({
          name: field.name,
          value: this.state.activityValues[field.name],
        }))
      },
    }

    //console.log('REQUEST DATA')
    //console.log(requestData)

    executeActivity(this.props.user, requestData).then(data => {
      console.log('EXECUTE ACTIVITY RESPONSE')
      console.log(data)
      // return result
      if (this.state.currentActivity.name === "Detailauskunft") {
        // open link
        window.open(data.link, "_blank")
      } else {
        // update policy data
        this.props.updatePolicy(
          this.props.index,
          {
            request_state: "ok",
            ...data,
          }
        )
      }
      // update state
      this.setState({
        activityExecutes: false,
        currentActivity: null,
        activityValues: {},
      })
    }).catch(error => {
      console.log('EXECUTE ERROR:')
      console.log(error)
      this.setState({
        activityExecutes: false,
        currentActivity: null,
        activityValues: {},
      })
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
                value={this.state.currentActivity === null ? "none" : this.state.currentActivity.name}
                onChange={this.handleActivitySelect}
                disabled={this.actionsNotAvailable}
                label={props.t("common:action")}
              >
                <MenuItem value="none">
                  <em>{props.t("common:none")}</em>
                </MenuItem>
                {this.props.policy.possible_activities.map((activity, index) => (
                  <MenuItem key={`${activity.name}-${index}`} value={activity.name}>
                    {activity.name}
                  </MenuItem>
                ))}
              </Select>
            </ActionControl>
            <ProgressButton
              title={props.t('common:execute')}
              loading={this.state.activityExecutes}
              disabled={!this.validateActivity()}
              onClick={this.handleActivityExecution}
            />
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
            value={this.state.activityValues[props.index]}
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
            value={this.state.activityValues[props.index]}
          />
      )}
    </Tooltip>
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
              <React.Fragment>
              {/* DEBUG: broke antrag */}
                <BrokeCard card="Policy" />

              {/* Close Button */}
                <Tooltip title={t("common:close")}>
                  <IconButton 
                    onClick={this.handleCloseClick}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            }
            title={<this.RenderHeader t={t} />}
            subheader={this.props.policy.effective_date}
          />
          {this.state.currentActivity !== null && 
           this.state.currentActivity.fields.filter(field => field.fieldType === 1).length > 0 &&
            <CardContent>
              <DataGroup 
                id={this.props.policy.id}
                title={this.state.currentActivity.description}
                fields={this.state.currentActivity.fields}
                values={this.state.activityValues}
                stage={this.props.stage}
                onChange={this.handleActivityDataChanged}
              />
            </CardContent>
          }
          <CardBottom>
            <ExpandButton expanded={this.state.expanded} onClick={this.handleExpandClick} />
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
  user: state.user,
})

const mapDispatchToProps = {
  closePolicyCard: removePolicy,
  updatePolicy: updatePolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatedActivePolicy)
