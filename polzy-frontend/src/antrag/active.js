import React, { useState } from 'react'
import { connect } from 'react-redux'
import { 
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Collapse,
  LinearProgress,
  TextField,
  Chip,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from '../styles/cards'
import { AntragTitle } from './components'
import ExpandButton from '../components/expandButton'
import ProgressButton from '../components/progressButton'
import DataGroup from '../components/dataFields'
import { removeAntrag, updateAntrag, addAntrag } from '../redux/actions'
import { executeAntrag, cloneAntrag, updateAntragFields } from '../api/antrag'
import { ActivityIcon } from '../components/icons'
// test imports
import {BrokeCard} from '../debug/damageCard'


// set styles
const useStyles = makeStyles((theme) => ({
  flexContainerVertical: {
    display: 'flex',
    flexDirection: 'column',
  },

  flexContainerRight: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },

  customTagInput: {
    width: 240,
    verticalAlign: "middle",
    marginRight: theme.spacing(1),
  },

  horizontalMargin: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  verticalMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  marginSizeSmall: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: -theme.spacing(1)/2,
    marginBottom: -theme.spacing(1)/2,
  },

  linearProgress: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },

}));


function AntragCard(props) {
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


/*
** Custom Tag
*/
function CustomTag(props) {
  const classes = useStyles()

  const [textValue, setTextValue] = useState('')

  const handleValueChange = (event) => {
    setTextValue(event.target.value)
  }

  const handleTagAdd = () => {
    setTextValue('')
    props.onChange(textValue)
  }

  const handleTagDelete = () => {
    setTextValue('')
    props.onChange('')
  }

  if (props.text === '') {
    return (
      <React.Fragment>
        {textValue !== '' &&
          <IconButton
            onClick={handleTagAdd}
            aria-label="custom-tag"
          >
            <SaveIcon />
          </IconButton>
        }
        <TextField
          classes={{root: classes.customTagInput}}
          placeholder={props.label}
          size="small"
          value={textValue}
          onChange={handleValueChange}
        />
      </React.Fragment>
    )
  } else {
    return (
      <Chip
        classes={{root: classes.horizontalMargin}}
        label={props.text}
        onDelete={handleTagDelete}
        color="primary"
        variant="outlined"
        icon={<LocalOfferOutlinedIcon />}
      />
    )
  }
}

function ActiveAntrag(props) {
  const {antrag} = props
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()

  const [hidden, setHidden] = useState(false)
  const [autoCalculateDisabled, setAutoCalculateDisabled] = useState(false)

  // groups states
  const getGroups = (obj) => {
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      [group.name]: group.valueChosenOrEntered === "True",
    }), {})
  }
  
  // values states
  const getValues = (obj) => {
    const commonFields = obj.fields.reduce((result, field) => ({
      ...result,
      [field.name]: field.fieldDataType === "Flag" ? (
        field.valueChosenOrEntered === "True"
      ) : (
        field.valueChosenOrEntered === undefined || field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
      ),
    }), {})
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      ...obj[group.name].filter((field) => 
        (field.fieldDataType !== "Table")
      ).reduce((groupFields, field) => ({
        ...groupFields,
        [field.name]: field.fieldDataType === "Flag" ? field.valueChosenOrEntered === "True" : (
          field.valueChosenOrEntered === undefined || field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
        ),
      }), {}),
    }), {...commonFields})
  }

  const [groups, setGroups] = useState({...getGroups(antrag)})
  const [values, setValues] = useState({...getValues(antrag)})

  //activity states
  const [currentActivity, setActivity] = useState(null)
  const [activityGroups, setActivityGroups] = useState({})
  const [activityValues, setActivityValues] = useState({})

  const getActivityValues = (activity) => {
    // update activity values
    let activityValues
    if ("field_groups" in activity) {
      const newGroups = getGroups(activity)
      setActivityGroups(newGroups)
      activityValues = {...getValues(activity)}
    } else {
      activityValues = {...activityValues, ...activity.fields.filter((field) => 
        (field.fieldDataType !== "Table")
      ).reduce((result, field) => ({
        ...result,
        [field.name]: field.fieldDataType === "Flag" ? field.valueChosenOrEntered === "True" : (
          field.valueChosenOrEntered === undefined || field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
        ),
      }), {})}
    }

    // update address values
    if (activity.name === "VN festlegen") {
      const addressKeys = [
        "country",
        "postCode",
        "city",
        "street",
        "streetNumber",
        "houseNumber",
      ]

      activityValues = {
        ...activityValues,
        ...addressKeys.reduce((result, key) => ({...result, [key]: values[key]}), {}),
        addressNumber: values.addressNumber,
        address: addressKeys.filter(key => values[key] !== '').reduce((label, key) => ([...label, values[key]]), []).join(' ')
      }
    }
    setActivityValues(activityValues)
  }

  // get values on antrag update
  React.useEffect(() => {
    // update antrag values
    setGroups({...getGroups(antrag)})
    setValues({...getValues(antrag)})

    // update activity values
    if (Boolean(currentActivity)) {
      const updatedActivity = antrag.possible_activities.filter(activity => activity.name === currentActivity.name)[0]
      setActivity(updatedActivity)
      getActivityValues(updatedActivity)
    }
  }, [antrag])

  // other states
  const [isCalculate, setCalculate] = useState(false)
  const [isExecuting, setExecute] = useState(false)
  const [customTag, setCustomTag] = useState('')
  const [expanded, setExpanded] = useState(true)

  const getPremium = () => {
    for (const field of antrag.fields) {
      if (field.name === 'premium') {
        return field.valueChosenOrEntered === "None" ? ("") : (field.valueChosenOrEntered)
      }
    }
    
    return ""
  }

  const validateFields = () => {
    // build 'check' groups
    const fieldGroups = antrag.field_groups ? (
      antrag.field_groups.filter(group => groups[group.name]).concat({name: 'fields'})
    ):(
      [{name: 'fields'}]
    )

    // checks if all mandatory fields are filled
    for (const group of fieldGroups) {
      for (const field of antrag[group.name].filter(field => field.fieldType === 1)) {
        
        // mandatory fields
        if (field.isMandatory && (values[field.name] === "" || values[field.name] === null)){
          return false
        }
        
        // numeric values in range
        if (
          values[field.name] &&
          field.fieldDataType === "Zahl" &&
          field.inputRange &&
          field.inputRange[0] === "range" &&
          (values[field.name] < Number(field.inputRange[1]) || values[field.name] > Number(field.inputRange[2]))
        ) {
          return false
        }

      }
    }
    return true
  }

  const getFieldByName = (instance, name) => {
    // returns field of instace by its name
    // check fields
    if (Boolean(instance.fields)) {
      for (const field of instance.fields) {
        if (field.name === name)
          return field
      }
    }

    // check groups
    if (Boolean(instance.field_groups)) {
      for (const group of instance.field_groups) {
        for (const field of instance[group.name]) {
          if (field.name === name)
            return field
        }
      }
    }

    return null
  }

  const handleCloseClick = () => {
    setHidden(true)
    setTimeout(() => {props.closeAntrag(props.index)}, hideTime)
  }

  const isCloneAvailable = () => {
    for (const activity of antrag.possible_activities) {
      if (activity.name === "Clone")
        return true
    }

    return false
  }

  const handleCloneClick = () => {
    // request antrag copy
    cloneAntrag(props.user, antrag.id).then(data => {
      props.newAntrag(
        {
          request_state: "ok",
          ...data,
        }
      )
    }).catch(error => {
      console.log(error)
    })
  }

  const updateGroupVisibility = (name, value) => {
    // check if group switch requires field update
    for (const group of antrag.field_groups) {
      if (group.name === name && group.inputTriggers) {
        console.log('UPDATE FIELDS BY GROUP SWITCH')
        // build request data
        const requestData = {
          id: antrag.id,
          values: {
            ...groups,
            ...values,
            [name]: value,
          }
        }
        updateAntragFields(props.user, requestData).then(data => {
          // update antrag
          props.updateAntrag(
            props.index,
            {
              request_state: "ok",
              ...data,
            }
          )
        }).catch(error => {
          console.log(error)
        }) 
        return
      }
    }

    // field update not required
    setGroups((preValues) => ({
      ...preValues,
      [name]: value,
    }))
  }


  const calculateAntrag = (newValues={}) => {
    setCalculate(true)
    // build request body
    const requestData = {
      id: antrag.id,
      activity: "Berechnen",
      values: {
        ...groups,
        ...values,
        ...newValues,
      },
    }

    // calculate antrag
    executeAntrag(props.user, requestData).then(data => {
      // update antrag
      props.updateAntrag(
        props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
      //update state
      setCalculate(false)
    }).catch(error => {
      console.log(error)
      //update state
      setCalculate(false)
    })
  }


  const updateAntrag = (newValues) => {
    /* update antrag fields */
    // build request body
    const requestData = {
      id: antrag.id,
      values: {
        ...groups,
        ...values,
        ...newValues,
      }
    }

    // call update end-point
    updateAntragFields(props.user, requestData).then(data => {
      // update antrag
      props.updateAntrag(
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

  /*
  ** Auto Calculate
  */
  React.useEffect(() => {
    //console.log('AUTOCALCULATE')
    //console.log(!autoCalculateDisabled)
    if (antrag.status === "Neu" && !autoCalculateDisabled && validateFields()) {
      console.log('Make autocalculation')
      calculateAntrag()
    }
  }, [antrag, values, groups, autoCalculateDisabled])


  /*
  ** update antrag on input trigger
  */
  const handleInputTrigger = (newValues={}) => {
    // build request body
    const requestData = {
      id: antrag.id,
      values: {
        ...groups,
        ...values,
        ...newValues,
      }
    }

    // call update end-point
    updateAntragFields(props.user, requestData).then(data => {
      // disable auto calculation
      setAutoCalculateDisabled(true)
      // update antrag
      props.updateAntrag(
        props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      //console.log('FINALLY')
      setAutoCalculateDisabled(false)
    })
  }

  const handleDataChanged = (newValues) => {
    // update field values
    setValues(preValues => ({
      ...preValues,
      ...newValues,
    }))

  }

  const handleCalculateClick = () => {
    calculateAntrag()
  }

  const validateActivityFields = () => {
    // check if activity selected
    if (currentActivity === null)
      return false

    // build 'check' groups
    const fieldGroups = currentActivity.field_groups ? (
      currentActivity.field_groups.filter(group => activityGroups[group.name]).concat({name: 'fields'})
    ):(
      [{name: 'fields'}]
    )

    // check if required activity fields are filled correctely
    for (const group of fieldGroups) {
      for (const field of currentActivity[group.name].filter(field => field.fieldType === 1)) {

        // mandatory fields
        if(field.isMandatory && activityValues[field.name] === '') {
          return false
        }

        // numeric values in range
        if (
          activityValues[field.name] &&
          field.fieldDataType === "Zahl" &&
          field.inputRange &&
          field.inputRange[0] === "range" &&
          (activityValues[field.name] < Number(field.inputRange[1]) || activityValues[field.name] > Number(field.inputRange[2]))
        ) {
          return false
        }
      }
    }
    return true
  }

  const executeActivity = (activity=currentActivity) => {
    // exit if activity should be closed
    if (activity.postExecution === 'close') {
      setActivity(null)
      return
    }
    
    // switch calculate mode
    setExecute(true)
    // build request body
    const requestData = {
      id: antrag.id,
      activity: activity.name,
      values: {
        ...activityGroups,
        ...activityValues,
      },
    }

    // execute activity
    executeAntrag(props.user, requestData).then(data => {

      //console.log('EXECUTION ACTIVITY:')
      //console.log(activity)
      //console.log('RESPONSE DATA:')
      //console.log(data)
      
      // post define behavior
      switch (activity.postExecution) {
        case 'link':
          window.open(data.link, "_blank")
          break
        case 'close':
          break
        default:
          props.updateAntrag(
            props.index,
            {
              request_state: "ok",
              ...data,
            }
          )
      }
      
      //update state
      setExecute(false)
      if (activity.postExecution !== 'active') {
        setActivity(null)
      }

    }).catch(error => {
      console.log(error)
      //update state
      setExecute(false)

      console.log('Execute Activity Error:')
      console.log(currentActivity)
    })
  }

  const updateActivityGroupVisibility = (name, value) => {
    setActivityGroups((preValues) => ({
      ...preValues,
      [name]: value,
    }))
  }

  const handleActivityInputTrigger = (newValues={}) => {
    /* 
    ** update antrag fields
    */

    // build request body
    const requestData = {
      id: antrag.id,
      activity: currentActivity.name,
      values: {
        ...activityGroups,
        ...activityValues,
        ...newValues,
      },
    }

    // call update end-point
    updateAntragFields(props.user, requestData).then(data => {
      // update antrag
      props.updateAntrag(
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

  const handleActivityDataChanged = (newValues) => {
    setActivityValues(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const handleActivitySelect = (event, value) => {

    // check if activity is executing
    if (isExecuting || isCalculate) {
      return
    }

    const newActivity = antrag.possible_activities.filter(activity => activity.name === value)[0]

    // execute activity if doesn't require inputs
    if (
      (newActivity.fields.length === 0 && !("field_groups" in newActivity)) || 
      ("field_groups" in newActivity && newActivity.field_groups.length === 0)
    ) {
      executeActivity(newActivity)
      return
    }
    getActivityValues(newActivity)

    // update current activity
    setActivity(newActivity)

  }

  const handlePartnerSelect = (partner) => {
    if (partner === '') {
      return
    }

    if ('partnerNumber' in partner) {
      setActivityValues(preValues => ({
        ...preValues,
        PartnerID: partner.partnerNumber,
        Firstname: partner.firstName,
        Lastname: partner.lastName,
        DateOfBirth: partner.birthdate,
        Gender: "",
        addressNumber: "",
        country: "",
        postcode: partner.postCode,
        city: partner.city,
        street: partner.street,
        streetNumber: "",
        houseNumber: partner.houseNumber,
      }))
    } else {
      setActivityValues(preValues => ({
        ...preValues,
        PartnerID: "",
        Firstname: partner.firstName,
        Lastname: partner.lastName,
        DateOfBirth: "",
        Gender: partner.gender,
        addressNumber: partner.address.addressNumber,
        country: partner.address.country,
        postcode: partner.address.postCode,
        city: partner.address.city,
        street: partner.address.street,
        streetNumber: partner.address.streetNumber,
        houseNumber: partner.address.houseNumber,
      }))
    }
    
  }

  //***** BEBUG OUTPUT
  //console.log('Antrag Props:')
  //console.log(props)
  
  return(
    <AntragCard
      hidden={hidden}
      content={
        <React.Fragment>
          <CardTop
            action={
              <React.Fragment>

            {/* DEBUG: broke antrag */}
              <BrokeCard card="Antrag" />

              {/* Custom Tag */}
                <CustomTag
                  label={t("antrag:tag")}
                  text={customTag}
                  onChange={setCustomTag}
                />

              {/* Clone Button */}
                {isCloneAvailable() &&
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleCloneClick}
                  >
                    {t("common:copy")}
                  </Button>
                }

              {/* Close Button */}
                <Tooltip title={t("common:close")}>
                  <IconButton 
                    onClick={handleCloseClick}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            }
            title={<AntragTitle product={antrag.product_line.attributes.Produkt} />}
          />

        {/* Expand Button */}
          <CardBottom>
            <ExpandButton expanded={expanded} onClick={() => setExpanded(!expanded)} />
          </CardBottom>
                    
        {/* Collapsible Area */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>

              {/* Input Group Switchers */}
              <Grid container spacing={2}>
                {antrag.field_groups.filter((field) => (
                  field.fieldType === 1 && field.fieldDataType === "Flag"
                )).map((field) => (
                  <Grid item key={field.name} xs={6} md={4} lg={3}>
                    <Tooltip
                      title={field.tooltip}
                      placement="top"
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={groups[field.name]}
                            onChange={(e) => updateGroupVisibility(field.name, e.target.checked)}
                            name={field.name}
                            color="primary"
                          />
                        }
                        label={field.brief}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>

              {/* Input Groups */}
              <div className={classes.flexContainerVertical}>
                  {antrag.field_groups.map((group) => (
                    <React.Fragment key={group.name}>
                    {antrag[group.name].filter(field => field.fieldType < 3).length > 0 &&
                      <Collapse
                        in={groups[group.name]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <DataGroup 
                          id={antrag.id}
                          title={group.tooltip}
                          fields={antrag[group.name]}
                          values={values}
                          onChange={handleDataChanged}
                          onInputTrigger={handleInputTrigger}
                          backgroundColor={group.backgroundColor}
                          subtitles={group.subtitles}
                        />
                      </Collapse>
                    }
                    </React.Fragment>
                  ))}
              </div>

              {/* Premium Field */}
              {antrag.status !== "Neu" && (
                <div className={classes.flexContainerRight}>
                  <Typography
                    className={classes.verticalMargin}
                    component="div"
                    variant="h5"
                  >
                    {`${t("antrag:premium")}: € ${getPremium()}`}
                  </Typography>
                </div>
              )}
              </CardContent>

            {/* Calculate Button */}
            <CardActions classes={{root: classes.flexContainerRight}} >
              <ProgressButton
                title={antrag.status === "Neu" ? t('antrag:calculate') : t('antrag:re-calculate')}
                loading={isCalculate}
                disabled={!validateFields()}
                onClick={handleCalculateClick}
              />
            </CardActions>

            {/* Activity Fields */}
            {/* Activity with Field Groups */}
            {currentActivity !== null && ("field_groups" in currentActivity) && currentActivity.field_groups.length > 0 &&
              <React.Fragment>
                {/* Input Group Switchers */}
                <Grid container spacing={2}>
                  {currentActivity.field_groups.filter((field) => (
                    field.fieldType === 1 && field.fieldDataType === "Flag"
                  )).map((field) => (
                    <Grid item key={field.name} xs={6} md={4} lg={3}>
                      <Tooltip
                        title={field.tooltip}
                        placement="top"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={activityGroups[field.name]}
                              onChange={(e) => updateActivityGroupVisibility(field.name, e.target.checked)}
                              name={field.name}
                              color="primary"
                            />
                          }
                          label={field.brief}
                        />
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>

                {/* Input Groups */}
                <div className={classes.flexContainerVertical}>
                    {currentActivity.field_groups.map(group => (
                      <Collapse
                        key={group.name}
                        in={activityGroups[group.name]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <DataGroup 
                          id={antrag.id}
                          title={group.tooltip}
                          fields={currentActivity[group.name]}
                          values={activityValues}
                          onChange={handleActivityDataChanged}
                          onInputTrigger={handleActivityInputTrigger}
                          onGlobalChange={handleDataChanged}
                          updateAntrag={updateAntrag}
                          onCloseActivity={() => setActivity(null)}
                        />
                      </Collapse>
                    ))}
                </div>
                <div className={classes.flexContainerRight} >
                  <ProgressButton
                    title={currentActivity.postExecution === "close" ? t('common:close') : t('common:execute')}
                    loading={isExecuting}
                    disabled={!validateActivityFields()}
                    onClick={(e) => executeActivity()}
                  />
                </div>
              </React.Fragment>
            }

            {/* Activity without Groups */}
            {currentActivity !== null && currentActivity.fields.filter(field => field.fieldType < 3).length > 0 &&
              <DataGroup
                id={antrag.id}
                title={currentActivity.description}
                fields={currentActivity.fields}
                values={activityValues}
                onGlobalChange={handleDataChanged}
                onChange={handleActivityDataChanged}
                onInputTrigger={handleActivityInputTrigger}
                onSelect={handlePartnerSelect}
                companyTypes={getFieldByName(currentActivity, "firmenArten")}
                actions={
                  <div className={classes.flexContainerRight} >
                    <ProgressButton
                      title={currentActivity.postExecution === "close" ? t('common:close') : t('common:execute')}
                      loading={isExecuting}
                      disabled={!validateActivityFields()}
                      onClick={(e) => executeActivity()}
                    />
                  </div>
                }
              />
            }

            {/* Loading animation */}
            {isExecuting && 
              <LinearProgress classes={{root: classes.linearProgress}} />
            }

            {/*Boolean(currentActivity) && currentActivity.name === "Eurotax Vollsuche" &&
              <EnhancedTable
                title="Eurotax Vollsuche"
                data={tableData}
              />
            */}

            {/* bottom navigation */}
            <CardContent>
              <BottomNavigation
                value={currentActivity !== null && currentActivity.name}
                showLabels
                onChange={handleActivitySelect}
              >
                {antrag.possible_activities.filter(activity => (
                  activity.name !== "Berechnen" && activity.name !== "Clone"
                )).map((activity, index) => (
                    <BottomNavigationAction
                      key={index}
                      label={activity.name}
                      value={activity.name}
                      icon={<ActivityIcon icon={activity.icon} />}
                    />
                ))}
              </BottomNavigation>
            </CardContent>
            
          </Collapse>
        </React.Fragment>
      }
    />
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  closeAntrag: removeAntrag,
  updateAntrag: updateAntrag,
  newAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAntrag)
