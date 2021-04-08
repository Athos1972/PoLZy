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
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from '../styles/cards'
import { PolicyTitle } from './Components'
import PolicyDetails from './policyDetails'
import { removePolicy, updatePolicy } from '../redux/actions'
import { executeActivity, deletePolicy, updatePolicyFields } from '../api/policy'
import CardCloseButton from '../components/closeButton'
import ExpandButton from '../components/expandButton'
import DataGroup from '../datafields/generalFields'
import ProgressButton from '../components/progressButton'
import { getFieldValue } from '../utils'
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

function ActivePolicy(props) {
  const {t} = useTranslation('common', 'policy')
  const {policy} = props

  const [expanded, setExpanded] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [activityExecutes, setActivityExecutes] = React.useState(false)
  const [currentActivity, setActivity] = React.useState()
  const [activityValues, setActivityValues] = React.useState({})

  const updateActivityValues = (activity) => {
    // get activity values from back-end
    setActivityValues({
      ...activityValues,
      ...activity.fields.filter((field) => 
        (field.fieldVisibilityType !== 2)
      ).reduce((result, field) => ({
        ...result,
        ...getFieldValue(field),
      }), {})
    })
  }
  
  const actionsNotAvailable = () => {
    if (policy.possible_activities && policy.possible_activities.length > 0) {
      return false
    }

    return true
  }  

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleDeleteCard = () => {
    props.closePolicyCard(props.index)

    // delete policy in back-end store
    deletePolicy(props.user, policy.id).then(data => {
      console.log(data)
    }).catch(error => {
      console.log(error)
    })
  }

  const getActivityByName = (name) => {
    // returns possible activity by its name
    for (const activity of policy.possible_activities) {
      if (activity.name === name) {
        return activity
      }
    }
    return undefined
  }

  const handleActivityDataChanged = (newValues) => {
    setActivityValues({
      ...activityValues,
      ...newValues,
    })
  }

  const clearCurrentActivity = () => {
    setActivity()
    setActivityValues({})
  }

  const handleActivitySelect = (event) => {
    const newActivity = getActivityByName(event.target.value)
    if (newActivity === "none") {
      clearCurrentActivity()
      return
    }

    console.log('New Activity:')
    console.log(newActivity)

    // update state
    setActivity(newActivity)
    updateActivityValues(newActivity)
  }

  const validateActivity = () => {
    // check if activity selected
    if (!currentActivity)
      return false

    // check if mandatory values are filled
    for (const field of currentActivity.fields) {
        if (field.isMandatory && !activityValues[field.name])
          return false
      }

    return true
  }

  const handleActivityExecution = () => {
    //console.log('Action Execution')
    setActivityExecutes(true)

    const requestData = {
      id: policy.id,
      activity: {
        name: currentActivity.name,
        fields: currentActivity.fields.map((field) => ({
          name: field.name,
          value: activityValues[field.name],
        }))
      },
    }

    //console.log('REQUEST DATA')
    //console.log(requestData)

    executeActivity(props.user, requestData).then(data => {
      console.log('EXECUTE ACTIVITY RESPONSE')
      console.log(data)
      // return result
      if (currentActivity.name === "Detailauskunft") {
        // open link
        window.open(data.link, "_blank")
      } else {
        // update policy data
        props.updatePolicy(
          props.index,
          {
            request_state: "ok",
            ...data,
          }
        )
      }
    }).catch(error => {
      console.log('EXECUTE ERROR:')
      console.log(error)
    }).finally(() => {
      // update state
      setActivityExecutes(false)
      clearCurrentActivity()
    })
  }

  const handleInputTrigger = (newValues={}) => {
    /*
    ** update policy fields
    */

    // build request body
    const requestData = {
      id: policy.id,
      activity: currentActivity.name,
      values: {
        ...activityValues,
        ...newValues,
      },
    }

    // call update end-point
    updatePolicyFields(props.user, requestData).then(data => {
      // update policy
      props.updatePolicy(
        props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
    }).catch(error => {
      console.log(error)
    }) 
  }

  // update current activity on policy update
  React.useEffect(() => {
    if (Boolean(currentActivity)) {
      const updatedActivity = policy.possible_activities.filter(activity => activity.name === currentActivity.name)[0]
      
      // curent activity not found in updated policy
      if (!updatedActivity) {
        clearCurrentActivity()
        return
      }

      setActivity(updatedActivity)
      updateActivityValues(updatedActivity)
    }
  }, [policy])


  const RenderHeader = (props) => (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} md={4}>
          <PolicyTitle number={policy.policy_number} />
        </Grid>
        <Grid item xs={12} md={8}>
          <FormGroup row>
            <ActionControl
              variant="outlined"
              size="small"
            >
              <InputLabel id={`action-${props.index}-label`}>
                {t("common:action")}
              </InputLabel>
              <Select
                labelId={`action-${props.index}-label`}
                id={`action-${props.index}`}
                value={currentActivity ? currentActivity.name :  "none"}
                onChange={handleActivitySelect}
                disabled={actionsNotAvailable()}
                label={t("common:action")}
              >
                <MenuItem value="none">
                  <em>{t("common:none")}</em>
                </MenuItem>
                {policy.possible_activities.map((activity, index) => (
                  <MenuItem key={`${activity.name}-${index}`} value={activity.name}>
                    {activity.name}
                  </MenuItem>
                ))}
              </Select>
            </ActionControl>
            <ProgressButton
              title={t('common:execute')}
              loading={activityExecutes}
              disabled={!validateActivity()}
              onClick={handleActivityExecution}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </React.Fragment>
  )

  const handleCloseCard = () => {
    setVisible(false)
  }

  // card appear animation
  React.useEffect(() => {
    setVisible(true)
  }, [])


  return(
    <Collapse
      in={visible}
      timeout={hideTime}
      unmountOnExit
    >
      <CardActive>
          <CardTop
            action={
              <React.Fragment>
              {/* DEBUG: broke antrag
                <BrokeCard card="Policy" />
              */}

              {/* Close Button */}
                <CardCloseButton
                  onClose={handleCloseCard}
                  onDelete={handleDeleteCard}
                />

              </React.Fragment>
            }
            title={<RenderHeader />}
            subheader={policy.effective_date}
          />
          {currentActivity && 
           currentActivity.fields.filter(field => field.fieldVisibilityType === 1).length > 0 &&
            <CardContent>
              <DataGroup 
                id={policy.id}
                title={currentActivity.description}
                fields={currentActivity.fields}
                values={activityValues}
                stage={props.stage}
                onChange={handleActivityDataChanged}
                onInputTrigger={handleInputTrigger}
              />
            </CardContent>
          }
          <CardBottom>
            <ExpandButton
              expanded={expanded}
              onClick={handleExpandClick}
            />
          </CardBottom>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <PolicyDetails policy={policy} />
            </CardContent>
          </Collapse>
      
      </CardActive>
    </Collapse>
  )

}


// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  closePolicyCard: removePolicy,
  updatePolicy: updatePolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivePolicy)
