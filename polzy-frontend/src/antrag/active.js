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
  Fade,
} from '@material-ui/core'
//import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from '../styles/cards'
import { AntragTitle } from './components'
import ExpandButton from '../components/expandButton'
import CardCloseButton from '../components/closeButton'
import ProgressButton from '../components/progressButton'
import FileUploadDialog from '../components/fileUploads'
import DataGroup from '../datafields/generalFields'
import { removeAntrag, updateAntrag, addAntrag, clearAddressList } from '../redux/actions'
import { executeAntrag, cloneAntrag, updateAntragFields, setCustomTag } from '../api/antrag'
import { ActivityIcon } from '../components/icons'
import Speedometer, { speedometerSize } from '../components/speedometer'
import { validateIBAN } from '../utils'
//import { getResource } from '../api/general'

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

  activityActionsContainer: {
    padding: theme.spacing(2),
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
}))



/*
** Custom Tag
*/
function CustomTagBase(props) {
  const classes = useStyles()
  const {t} = useTranslation('antrag')

  const [textValue, setTextValue] = useState('')

  const updateTag = (newValue) => {
    props.updateAntrag(
      props.index,
      {
        tag: newValue,
      }
    )
    
    // clear current text value
    setTextValue('')
  }

  const handleTagChange = () => {
    // update tag in back-end 
    setCustomTag(
      props.user,
      props.id,
      {
        action: 'set',
        tag: textValue,
      }
    ).then(() => {
      // update tag in front-end
      updateTag(textValue)
    }).catch(error => {
      console.log(error)
    })
  }

  const handleValueChange = (event) => {
    setTextValue(event.target.value)
  }

  const handleTagDelete = () => {
    // update tag in back-end 
    setCustomTag(
      props.user,
      props.id,
      {
        action: 'delete',
      }
    ).then(() => {
      // update tag in front-end
      updateTag()
    }).catch(error => {
      console.log(error)
    })
  }

  if (props.text) {
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
  } else {
    return (
      <React.Fragment>
        {textValue !== '' &&
          <IconButton
            onClick={() => handleTagChange()}
            aria-label="custom-tag"
          >
            <SaveIcon />
          </IconButton>
        }
        <TextField
          classes={{root: classes.customTagInput}}
          placeholder={t("antrag:tag")}
          size="small"
          value={textValue}
          onChange={handleValueChange}
        />
      </React.Fragment>
    )
  }
}

function ActiveAntrag(props) {
  const {antrag} = props
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()

  const cardRef = React.useRef()
  const calcRef = React.useRef()

  const [isVisible, setIsVisible] = useState()
  const [autoCalculateDisabled, setAutoCalculateDisabled] = useState(false)
  const [openUploadDialog, setOpenUploadDialog] = useState(false)

  // speedometer
  const [openSpeedometer, setOpenSpeedometer] = React.useState(false)
  const [speedometerIsSticky, setSpeedometerSticky] = React.useState(false)

  // groups states
  const getGroups = (obj) => {
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      [group.name]: group.valueChosenOrEntered === "True",
    }), {})
  }
  
  // values states
  const getFieldValue = (field) => {
    // parse antrag field value

    // Boolean with related fields 
    if (field.fieldDataType === "FlagWithOptions" && field.relatedFields) {
      return {
        [field.name]: field.valueChosenOrEntered === "True",
        ...field.relatedFields.reduce((result, subField) => ({
          ...result,
          ...getFieldValue(subField),
        }), {})
      }
    }

    // Boolean
    if (field.fieldDataType === "Flag" || field.fieldDataType === "FlagWithOptions") {
      return {[field.name]: field.valueChosenOrEntered === "True"}
    }

    // empty values
    if (field.valueChosenOrEntered === undefined || field.valueChosenOrEntered === "None") {
      return {[field.name]: ""}
    }

    // other
    return {[field.name]: field.valueChosenOrEntered}
  }

  const getValues = (obj) => {
    const commonFields = obj.fields.filter(field => (field.fieldType !== 2)).reduce((result, field) => ({
      ...result,
      ...getFieldValue(field),
    }), {})
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      ...obj[group.name].filter((field) => 
        (field.fieldType !== 2 && field.fieldDataType !== "Table")
      ).reduce((groupFields, field) => ({
        ...groupFields,
        ...getFieldValue(field),
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
      setActivityGroups({})
      activityValues = {...activityValues, ...activity.fields.filter((field) => 
        (field.fieldType !== 2)
      ).reduce((result, field) => ({
        ...result,
        ...getFieldValue(field),
      }), {})}
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
      if (!updatedActivity) {
        closeActivity()
        return
      }

      setActivity(updatedActivity)
      getActivityValues(updatedActivity)
    }
  }, [antrag])

  // card appear animation
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  // other states
  const [isCalculate, setCalculate] = useState(false)
  const [isExecuting, setExecute] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const updateAntragFromBackend = (antragData) => {
    props.updateAntrag(
      props.index,
      {
        request_state: "ok",
        ...antragData,
      }
    )
  }

  const getPremium = () => {
    for (const field of antrag.fields) {
      if (field.name === 'premium') {
        return field.valueChosenOrEntered === "None" ? ("") : (field.valueChosenOrEntered)
      }
    }
    
    return ""
  }

  const validateFieldList = (fieldList, fieldValues) => {
    for (const field of fieldList.filter(field => field.fieldType === 1)) {
        
      // mandatory fields
      if (
        field.isMandatory && 
        (fieldValues[field.name] === "" || fieldValues[field.name] === null || fieldValues[field.name] === undefined)
      ){
        //console.log('Validation Fails: Mandatory')
        //console.log(field)
        //console.log(fieldValues[field.name])
        return false
      }
        
      // numeric values in range
      if (
        fieldValues[field.name] &&
        field.fieldDataType === "Zahl" &&
        field.inputRange &&
        field.inputRange[0] === "range" &&
        (fieldValues[field.name] < Number(field.inputRange[1]) || fieldValues[field.name] > Number(field.inputRange[2]))
      ) {
        return false
      }

      // select fields
      if (fieldValues[field.name] && field.fieldDataType === "Text" && field.inputRange) {
        const valueList = field.inputRange[0] === "async" ? props.valueLists[field.inputRange[1]] : field.inputRange
        if (valueList && !valueList.includes(fieldValues[field.name])) {
          //console.log('Validation failed: Select')
          //console.log(field.name)
          return false
        }
      }

      // iban fields
      if (
        field.fieldDataType === "Text" &&
        field.name.toLowerCase().includes('iban') &&
        validateIBAN(fieldValues[field.name]) !== 1
      ) {
        //console.log('Validation failed: IBAN')
        return false
      }

      // fields with options
      if (field.relatedFields instanceof Array && field.relatedFields.length > 0 &&
        (fieldValues[field.name] === true || fieldValues[field.name] === "True") &&
        !validateFieldList(field.relatedFields, fieldValues)
      ) {
        //console.log('Validation fails: Field with options')
        //console.log(field)
        //console.log(fieldValues[field.name])
        return false
      }
    }

    return true
  }

  const validateFields = (isAntrag=true) => {
    const instance = isAntrag ? antrag : currentActivity
    const instanceGroups = isAntrag ? groups : activityGroups
    const instanceValues = isAntrag ? values : activityValues
    // build 'check' groups
    const fieldGroups = instance.field_groups ? (
      instance.field_groups.filter(group => instanceGroups[group.name]).concat({name: 'fields'})
    ):(
      [{name: 'fields'}]
    )

    // iterate fields for check
    for (const group of fieldGroups) {
      if (!validateFieldList(instance[group.name], instanceValues)) {
          //console.log('Validation fails')
          //console.log(group)
        return false
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
          updateAntragFromBackend(data)
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
      tag: antrag.tag,
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
      updateAntragFromBackend(data)
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      setCalculate(false)
    })
  }


  const updateAntrag = (newValues={}) => {
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
      updateAntragFromBackend(data)
    }).catch(error => {
      console.log(error)
    })
  }

  /*
  ** Auto Calculate
  */
  React.useEffect(() => {
    if (antrag.status === "Neu" && !autoCalculateDisabled && !isCalculate && validateFields()) {
      calculateAntrag()
    }
  }, [antrag, values, groups])


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
      updateAntragFromBackend(data)
    }).catch(error => {
      console.log(error)
    }).finally(() => {
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

  const closeActivity = () => {
    setActivity(null)
    setActivityGroups({})
    setActivityValues({})
  }

  const executeActivity = (action='run', activity=currentActivity, withFields=true) => {

    if (action === 'close') {
      closeActivity()
      return
    }

    if (action === 'upload') {
      setOpenUploadDialog(true)
      return
    }

    //console.log('Execute Activity:')
    //console.log(activity)
    
    // switch calculate mode
    setExecute(true)
    // build request body
    const requestData = {
      id: antrag.id,
      tag: antrag.tag,
      activity: activity.name,
    }

    if (withFields) {
      requestData.values = {
        ...activityGroups,
        ...activityValues,
      }
    }

    // execute activity
    executeAntrag(props.user, requestData).then(data => {
      
      // post define behavior
      switch (activity.postExecution) {
        case 'link':
        /*
          getResource(props.user, data.link).then(src => {
            window.open(src, "_blank")
          }).catch(error => {
            console.log(error)
          })
        */
          window.open(data.link, "_blank")
          break
        case 'close':
          break
        default:
          updateAntragFromBackend(data)
      }
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      //update state
      setExecute(false)

      if (activity.postExecution === 'active' || activity.postExecution === 'close') {
        return
      }

      closeActivity()
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
      updateAntragFromBackend(data)
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

    //console.log('Selected Activity:')
    //console.log(newActivity)

    // execute activity if doesn't require inputs
    if (
      (!newActivity.actions || newActivity.actions.length === 0) &&
      (newActivity.fields.length === 0 && !("field_groups" in newActivity)) || 
      ("field_groups" in newActivity && newActivity.field_groups.length === 0)
    ) {
      closeActivity()
      executeActivity('run', newActivity, false)
      return
    }
    
    // update current activity
    setActivity(newActivity)

    // update activity values
    getActivityValues(newActivity)

  }

  const handleCloseCard = () => {
    //setOpenSpeedometer(false)
    setIsVisible(false)
  }

  const handleDeleteCard = () => {
    props.clearAddressList(antrag.id)
    props.closeAntrag(props.index)
  }

  const isActivityOpen = (activityType=null) => {
    if (!currentActivity) {
      return false
    }

    const groupsExist = ("field_groups" in currentActivity) && currentActivity.field_groups.length > 0
    const fieldsExist = currentActivity.fields.filter(field => field.fieldType < 3).length > 0

    //console.log(`isActivityOpen: ${activityType}`)
    //console.log(`Groups: ${groupsExist}`)
    //console.log(`Fields: ${fieldsExist}`)

    switch (activityType) {
      case "groups":
        return groupsExist
      case "fields":
        return fieldsExist
      default:
        //console.log(`Return: ${groupsExist || fieldsExist}`)
        return groupsExist || fieldsExist
    }
  }

  //***** BEBUG OUTPUT
  //console.log('Antrag Props:')
  //console.log(props)
  //console.log('Current Activity:')
  //console.log(currentActivity)
  //console.log('Antrag Values:')
  //console.log(values)
  //console.log('Activity Values')
  //console.log(activityValues)
  //console.log(cardRef)



  /*
  ** Speedometer
  */
  React.useEffect(() => {
    if (!antrag.speedometerValue || !cardRef.current || window.innerWidth < 600) {
      setOpenSpeedometer(false)
      return
    }

    // card rect
    const cardRect = cardRef.current.getBoundingClientRect()
    //const cardBottom = cardTop + cardHeight
    //const scrollBottom = props.scrollTop + window.innerHeight

    // check if speedometer should be visible
    //console.log(`1st card: ${props.index === 0}`)
    //console.log(props.scrollTop)
    //console.log(cardRect)
    
    const openSpeedometer = (props.index === 0) ? (
      // 1st card
      cardRect.bottom > 0
    ) : (
      // other cards
      cardRect.bottom > 0 && cardRect.top < window.innerHeight - speedometerSize
    )

    setOpenSpeedometer(isVisible && openSpeedometer)
  }, [isVisible, props.scrollTop, antrag.speedometerValue])

  const [speedometerDivHeight, setSpeedometerDivHeight] = React.useState(0)

  React.useEffect(() => {
    if (!cardRef.current || !calcRef.current) {
      setSpeedometerDivHeight(0)
      return
    }

    const cardRect = cardRef.current.getBoundingClientRect()
    const calcRect = calcRef.current.getBoundingClientRect()
    const isSticky = cardRect.left > speedometerSize
    const marginToBottom = isSticky ? 0 : (cardRect.bottom - calcRect.bottom)

    setSpeedometerDivHeight(speedometerSize/2 + marginToBottom)
    setSpeedometerSticky(isSticky)
  }, [cardRef, calcRef, currentActivity, props.scrollTop])


  return(
    <React.Fragment>

    <Collapse
      in={isVisible}
      timeout={hideTime}
      unmountOnExit
    >
      <CardActive ref={cardRef}>
        
          <CardTop
            action={
              <React.Fragment>

              {/* DEBUG: broke antrag */}
                <BrokeCard card="Antrag" />

              {/* Custom Tag */}
                <CustomTag
                  index={props.index}
                  id={antrag.id}
                  text={antrag.tag}
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
                <CardCloseButton
                  onClose={handleCloseCard}
                  onDelete={handleDeleteCard}
                />

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
            <CardActions
              classes={{root: classes.flexContainerRight}}
              ref={calcRef}
            >
              <ProgressButton
                title={antrag.status === "Neu" ? t('antrag:calculate') : t('antrag:re-calculate')}
                loading={isCalculate}
                disabled={!validateFields()}
                onClick={handleCalculateClick}
              />
            </CardActions>

            {/* Activity Fields */}
            {/* Activity with Field Groups */}
            {isActivityOpen("groups") &&
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
                          onCloseActivity={closeActivity}
                          backgroundColor={group.backgroundColor}
                          subtitles={group.subtitles}
                        />
                      </Collapse>
                    ))}
                </div>
              </React.Fragment>
            }

            {/* Activity without Groups */}
            {isActivityOpen("fields") &&
              <Grid container>

                {/* Input Fields */}
                <Grid item xs={12}>
                  <DataGroup
                    id={antrag.id}
                    title={currentActivity.description}
                    fields={currentActivity.fields}
                    values={activityValues}
                    onGlobalChange={handleDataChanged}
                    onChange={handleActivityDataChanged}
                    onInputTrigger={handleActivityInputTrigger}
                    companyTypes={getFieldByName(currentActivity, "firmenArten")}
                    backgroundColor={currentActivity.backgroundColor}
                    subtitles={currentActivity.subtitles}
                  />
                </Grid>
              </Grid>
            }

            {/* Activity Actions */}
            {isActivityOpen() &&
              <Grid
                className={classes.activityActionsContainer}
                item
                xs={12}
                container
                spacing={2}
                justify="flex-end"
              >
                {!currentActivity.actions || !currentActivity.actions.length ? (
                  <Grid item>
                    <ProgressButton
                      title={t('common:execute')}
                      loading={isExecuting}
                      disabled={!validateFields(false)}
                      onClick={(e) => executeActivity()}
                    />
                  </Grid>
                ) : (
                  <React.Fragment>
                    {currentActivity.actions.map((action, index) => (
                      <Grid key={index} item>
                        <ProgressButton
                          title={action.caption}
                          loading={isExecuting}
                          disabled={action.name === 'close' ? false : !validateFields(false)}
                          onClick={(e) => executeActivity(action.name)}
                        />
                      </Grid>
                    ))}
                  </React.Fragment>
                )}
              </Grid>
            }

            {/* Loading animation */}
            {isExecuting && 
              <LinearProgress classes={{root: classes.linearProgress}} />
            }

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
        </CardActive>
    </Collapse>

    {/* Speedometer */}
      {openSpeedometer && expanded && antrag.speedometerValue &&
        <Fade in={openSpeedometer && expanded}>
          <div
            style={{
              //border: 'solid',
              display: 'flex',
              justifyContent: speedometerIsSticky ? 'flex-end': 'flex-start',
              position: speedometerIsSticky ? 'sticky' : 'static',
              bottom: 0,
              height: speedometerDivHeight,
              marginTop: -speedometerDivHeight,
              marginRight: speedometerIsSticky ? -speedometerSize : 0,
              pointerEvents: "none",
            }}
          >
          <Speedometer
            value={antrag.speedometerValue}
          />
          </div>
        </Fade>
      }

    {/* File Upload Dialog */}
      <FileUploadDialog
        parentId={antrag.id}
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onUpload={() => handleActivityInputTrigger()}
        withFileType
      />
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  valueLists: state.valueLists,
})

const mapDispatchToProps = {
  closeAntrag: removeAntrag,
  updateAntrag: updateAntrag,
  newAntrag: addAntrag,
  clearAddressList: clearAddressList,
}

const mapDispatchToPropsToCustomTag = {
  updateAntrag: updateAntrag,
}

const CustomTag = connect(mapStateToProps, mapDispatchToPropsToCustomTag)(CustomTagBase)
export default connect(mapStateToProps, mapDispatchToProps)(ActiveAntrag)
