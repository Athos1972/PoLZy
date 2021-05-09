import React from 'react'
import PropTypes from 'prop-types'
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
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
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
import { executeAntrag, cloneAntrag, deleteAntrag, updateAntragFields, setCustomTag } from '../api/antrag'
import { ActivityIcon } from '../components/icons'
import CustomTag from './customTag'
import Speedometer, { speedometerSize } from '../components/speedometer'
import { validateIBAN, getFieldValue } from '../utils'
import { getAntragEmail } from '../api/general'

// test imports
//import {BrokeCard} from '../debug/damageCard'


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
** Antrag Custom Tag

function CustomTagBase(props) {
  const classes = useStyles()
  const {t} = useTranslation('antrag')

  const [textValue, setTextValue] = React.useState('')

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

  const handleValueChange = (event) => {
    setTextValue(event.target.value)
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
          <Tooltip title={t("common:Save")}>
            <IconButton onClick={() => handleTagChange()} aria-label="custom-tag">
              <SaveOutlinedIcon />
            </IconButton>
          </ Tooltip>
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

CustomTagBase.propTypes = {
  index: PropTypes.number,
  id: PropTypes.string,
  text: PropTypes.string,
  user: PropTypes.object,
  updateAntrag: PropTypes.func,
}

// connect to redux store
const mapStateToPropsCustomTag = (state) => ({
  user: state.user,
})

const mapDispatchToPropsCustomTag = {
  updateAntrag: updateAntrag,
}

const CustomTag = connect(mapStateToPropsCustomTag, mapDispatchToPropsCustomTag)(CustomTagBase)
*/


/**
 * This component renders a product offer card with request status _OK_.
 * @see {@link AntragView.MapAntragCard} for possible request status of product offer
 *
 * @component
 * @category Product Offer
 */
function ActiveAntrag(props) {
  const {antrag} = props
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()

  /**
   * @typedef {object} ref
   * @ignore
   */
  /**
   * Ref: associated with the DOM node of the product offer card.
   *
   * @name cardRef
   * @type {ref}
   * @memberOf ActiveAntrag
   * @inner
   */
  const cardRef = React.useRef()
  /**
   * Ref: associated with the DOM node of the _calculate_ button of the product offer card.
   *
   * @name calcRef
   * @type {ref}
   * @memberOf ActiveAntrag
   * @inner
   */
  const calcRef = React.useRef()


  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State: Boolean flag that defines the card visibility.
   * Used to animate the card appearance and closure. 
   *
   * @name isVisible
   * @default false
   * @prop {boolean} isVisible - state
   * @prop {function} setIsVisible - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [isVisible, setIsVisible] = React.useState(false)
  /**
   * State: Boolean flag that defines if the product offer automatic calculation should be disabled.
   * By default, **_PoLZy_** calculates a product offer right after all the mandatory fields are filled.
   *
   * @name autoCalculateDisabled
   * @default false
   * @prop {boolean} autoCalculateDisabled - state
   * @prop {function} setAutoCalculateDisabled - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [autoCalculateDisabled, setAutoCalculateDisabled] = React.useState(false)
  /**
   * State: Boolean flag that shows if the product offer is calculating now.
   * Used to disable calculation requests if the previous calculation is still in progress.
   *
   * @name isCalculate
   * @default false
   * @prop {boolean} isCalculate - state
   * @prop {function} setCalculate - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [isCalculate, setCalculate] = React.useState(false)
  /**
   * State: Boolean flag that shows if a product offer activity is executing now.
   * Used to disable execution requests of activities
   * if the previous request of an activity execution is still in progress.
   *
   * @name isExecuting
   * @default false
   * @prop {boolean} isExecuting - state
   * @prop {function} setExecute - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [isExecuting, setExecute] = React.useState(false)
  /**
   * State: Boolean flag that defines the visual state (expanded or collapsed) of the product offer card.
   * If _true_ the card is expanded. 
   *
   * @name expanded
   * @default true
   * @prop {boolean} expanded - state
   * @prop {function} setExpanded - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [expanded, setExpanded] = React.useState(true)
  /**
   * State: Boolean flag that opens a [file upload dialog]{@link FileUploadDialog}.
   *
   * @name openUploadDialog
   * @default false
   * @prop {boolean} openUploadDialog - state
   * @prop {function} setOpenUploadDialog - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false)
  /**
   * State: Boolean flag that opens a [speedometer]{@link Speedometer}
   * that shows the efficiency of the selected options.
   *
   * @name openSpeedometer
   * @default false
   * @prop {boolean} openSpeedometer - state
   * @prop {function} setOpenSpeedometer - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [openSpeedometer, setOpenSpeedometer] = React.useState(false)
  /**
   * State: Boolean flag that signals if the product offer [speedometer]{@link Speedometer}
   * should be sticked to the card layout.
   * A sticky speedometer is used for smaller screen size when it can't be placed on page margins. 
   *
   * @name speedometerIsSticky
   * @default false
   * @prop {boolean} speedometerIsSticky - state
   * @prop {function} setSpeedometerSticky - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [speedometerIsSticky, setSpeedometerSticky] = React.useState(false)
  /**
   * State: Height of the `<div>` element that holds the [speedometer]{@link Speedometer}
   * connected to the product offer card.
   *
   * @name speedometerDivHeight
   * @default 0
   * @prop {object} speedometerDivHeight - state
   * @prop {function} setSpeedometerDivHeight - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [speedometerDivHeight, setSpeedometerDivHeight] = React.useState(0)
  /**
   * State: Object that holds the current state of the groups of the product offer fields in form
   * ```javascript
   * {
   *   <groupName>: false | true
   * }
   * ```
   * A product offer can provide optional groups of input fields.
   * In such a case, the product offer card renders on its top switches,
   * which control the state of that groups.
   *
   * @name groups
   * @default {}
   * @prop {object} groups - state
   * @prop {function} setGroups - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [groups, setGroups] = React.useState({})
  /**
   * State: Object that holds the current values of the product offer input fields in form
   * ```javascript
   * {
   *   <fieldName>: <value>
   * }
   * ```
   *
   * @name values
   * @default {}
   * @prop {object} values - state
   * @prop {function} setValues - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [values, setValues] = React.useState({})
  /**
   * State: Object that holds the currently selected activity of the product offer.
   * If no activity selected then _undefined_.
   *
   * @name currentActivity
   * @default undefined
   * @prop {object | undefined} currentActivity - state
   * @prop {function} setActivity - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [currentActivity, setActivity] = React.useState()
  /**
   * State: Object that holds the current state of the groups of the input fields of the current activity in form 
   * ```javascript
   * {
   *   <groupName>: false | true
   * }
   * ```
   * A product offer activity can provide optional groups of input fields.
   * In such a case, the product offer card renders switches, which control the state of that groups,
   * on the top of the current activity section
   *
   * @name activityGroups
   * @default {}
   * @prop {object} activityGroups - state
   * @prop {function} setActivityGroups - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [activityGroups, setActivityGroups] = React.useState({})
  /**
   * State: Object that holds the current values of the input field of the current activity in form
   * ```javascript
   * {
   *   <fieldName>: <value>
   * }
   * ```
   *
   * @name activityValues
   * @default {}
   * @prop {object} activityValues - state
   * @prop {function} setActivityValues - setter
   * @type {state}
   * @memberOf ActiveAntrag
   * @inner
   */
  const [activityValues, setActivityValues] = React.useState({})
  

  /**
   * Method<br/>
   * Collects status of the groups of the input fields from the passed argument _obj_.
   * Used to update the group statuses while updating the product offer object on the back-end.
   *
   * @function
   * @arg {object} obj
   * Object that contains input fields in required format.
   * It can be the product offer object received from from back-end or an object of product offer activity.
   * @returns {object}
   * Object that can be set to state [groups]{@link ActiveAntrag~groups}
   * or [activityGroups]{@link ActiveAntrag~activityGroups}.
   */
  const getGroups = (obj) => {
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      [group.name]: group.value === "True",
    }), {})
  }

  /**
   * Method<br/>
   * Collects values of the input fields from the passed argument _obj_.
   * Used to update the values of the input fields while updating the product offer object on the back-end.
   *
   * @function
   * @arg {object} obj
   * Object that contains input fields in required format.
   * It can be the product offer object received from from back-end or an object of product offer activity.
   * @returns {object}
   * Object that can be set to state [values]{@link ActiveAntrag~values}
   * or [activityValues]{@link ActiveAntrag~activityValues}.
   */
  const getValues = (obj) => {
    const commonFields = obj.fields.filter(field => (field.fieldVisibilityType !== 2)).reduce((result, field) => ({
      ...result,
      ...getFieldValue(field),
    }), {})
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      ...obj[group.name].filter((field) => 
        (field.fieldVisibilityType !== 2 && field.fieldDataType !== "Table")
      ).reduce((groupFields, field) => ({
        ...groupFields,
        ...getFieldValue(field),
      }), {}),
    }), {...commonFields})
  }

/*
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
        (field.fieldVisibilityType !== 2)
      ).reduce((result, field) => ({
        ...result,
        ...getFieldValue(field),
      }), {})}
    }

    setActivityValues({...activityValues})
  }
*/

  // get values on antrag update
  /**
   * Updates states [groups]{@link ActiveAntrag~groups} and [values]{@link ActiveAntrag~values}
   * from the product offer object stored in _redux_, when it changes.
   * If state [currentActivity]{@link ActiveAntrag~currentActivity} is not _undefined_ then
   * also updates it.
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 1
   * @arg {object} antrag
   * prop [antrag]{@link ActiveAntrag}
   */
  React.useEffect(() => {
    /**
     * Updates _groups_ and _values_ of the product offer
     */
    setGroups({...getGroups(antrag)})
    setValues({...getValues(antrag)})

    /**
     * Updates current activity.
     */
    if (currentActivity) {
      const updatedActivity = getActivityByName(antrag, currentActivity.name)
      if (!updatedActivity) {
        setActivity()
        return
      }

      setActivity(updatedActivity)
    }
  }, [antrag])

  /**
   * Updates states [activityGroups]{@link ActiveAntrag~activityGroups}
   * and [activityValues]{@link ActiveAntrag~activityValues} from the product offer object
   * stored in _redux_, when state [currentActivity]{@link ActiveAntrag~currentActivity} changes.
   * If [currentActivity]{@link ActiveAntrag~currentActivity} changes to _undefined_ then
   * sets the default values to [activityGroups]{@link ActiveAntrag~activityGroups}
   * and [activityValues]{@link ActiveAntrag~activityValues}.
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 2
   * @arg {object} currentValue
   * state [currentActivity]{@link ActiveAntrag~currentActivity}
   */
  React.useEffect(() => {
    if (currentActivity) {     
      const isGroupedFields = ("field_groups" in currentActivity)
      const lActivityGroups = isGroupedFields ? getGroups(currentActivity) : {}
      const lActivityValues = isGroupedFields ? getValues(currentActivity) : {}

      /**
       * Collects ungrouped input fields
       *
       */
      setActivityValues({
        ...activityValues,
        ...currentActivity.fields.filter((field) => 
          (field.fieldVisibilityType !== 2)
        ).reduce((result, field) => ({
          ...result,
          ...getFieldValue(field),
        }), {})
      })
      setActivityGroups({...lActivityGroups})
    
      return
    }

    /**
     * Sets default values if no current activity set.
     */
    setActivityGroups({})
    setActivityValues({})

  }, [currentActivity])

  /**
   * Implements animation of the card appearance
   * by setting state [isVisible]{@link ActiveAntrag~isVisible} to _true_.
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 3
   */
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  /**
   * Implements closer of the current activity if its post-execution behavior set to _close_.
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 4
   * @arg {boolean} isExecuting
   * state [isExecuting]{@link ActiveAntrag~isExecuting}
   */
  React.useEffect(() => {
    if (!isExecuting && currentActivity && currentActivity.postExecution === 'close') {
      setActivity()
    }
  }, [isExecuting])

  /**
   * Method<br/>
   * Updates product offer object in the _redux_ store by the received _antragData_.
   *
   * @function
   * @arg {object} antragData
   * Product offer object received from the back-end.
   */
  const updateAntragFromBackend = (antragData) => {
    props.updateAntrag(
      props.index,
      {
        request_state: "ok",
        ...antragData,
      }
    )
  }

  /**
   * Method<br/>
   * Extracts the value of field _premium_ from the product offer object.
   *
   * @function
   * @returns {string}
   * value of field _premium_ of prop [antrag]{@link ActiveAntrag}.
   */
  const getPremium = () => {
    for (const field of antrag.fields) {
      if (field.name === 'premium') {
        return field.value === "None" ? ("") : (field.value)
      }
    }
    
    return ""
  }

  /**
   * Method<br/>
   * Recursion method that validates the input fields by a list and values.<br/> 
   * The validation criteria are as follow:
   * * if field is mandatory then it should have a value
   * * if a numeric field defines a range of the possible values then its value should be within the range
   * * if a field provides a list of the possible values then its value should be within the list
   * * value of an IBAN field should be a correct IBAN
   * * if a boolean field takes value _true_ and has required subfield
   * then the values of the mandatory subfields should be also set 
   *
   * @function
   * @arg {array} fieldList
   * list of the field object to validate
   * @arg {object} fieldValues
   * state object [values]{@link ActiveAntrag~values} or [activityValues]{@link ActiveAntrag~activityVAlues}
   * that holds the current values of the input fields
   * @returns {boolean}
   * results of the validation of the provided input fields
   */
  const validateFieldList = (fieldList, fieldValues) => {
    for (const field of fieldList.filter(field => field.fieldVisibilityType === 1)) {
        
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

  /**
   * Method<br/>
   * Validates the input fields of the product offer or its activity.<br/>
   * Calls method [validateFieldList]{@link ActiveAntrag~validateFieldList}
   * for every group (represented as a list) of input fields including ungrouped fields.
   * 
   * @arg {boolean} isAntrag=true
   * Flag that defines the source of the fields to be validate.<br/>
   * If _true_ then the method extracts input fields from prop [antrag]{@link ActiveAntrag},
   * if _false_ &ndash; from state [currentActivity]{@link ActiveAntrag~currentActivity}.<br/>
   * @returns {boolean}
   * results of the validation of the all the input fields of the product offer or its activity
   */
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
/*
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
*/

  /**
   * Method<br/>
   * Checks if the product offer provides _clone_ activity.
   * 
   * @returns {boolean}
   */
  const isCloneAvailable = () => {
    for (const activity of antrag.possible_activities) {
      if (activity.name === "Clone")
        return true
    }

    return false
  }


  /**
   * Event Handler<br/>
   * **_Event:_** click _clone_ button.<br/>
   * **_Implementation:_** calls back-end (_{@link cloneAntrag}_) to make a copy of the product offer.
   * If the response is successful then fires callback [prop.newAntrag]{@link ActiveAntrag}
   * to add the cloned product offer instance to the _redux_ store.
   */
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

  /**
   * Event Handler<br/>
   * **_Event:_** change state of a group _switch_.<br/>
   * **_Implementation:_** if the input group's prop `inputTriggers == true` then the method
   * calls the back-end (_{@link updateAntragFields}_) to update the product offer instance
   * with the actual values of the input fields. On the successful response,
   * it pushes the obtained from the back-end product offer instance to
   * [updateAntragFromBackend]{@link ActiveAntrag~updateAntragFromBackend}<br/>
   * If the input group's prop `inputTriggers == false` then the method sets
   * the value of prop _name_ of the state [groups]{@link ActiveAntrag~groups} to _value_.
   *
   * @arg {string} name
   * name of a group of input fields
   * @arg {boolean} value
   * new value of the group visibility
   */
  const updateGroupVisibility = (name, value) => {
    // check if group switch requires field update
    for (const group of antrag.field_groups) {
      if (group.name === name && group.inputTriggers) {
        /**
         * build request payload  to update product offer on the back-end
         */
        const requestData = {
          id: antrag.id,
          values: {
            ...groups,
            ...values,
            [name]: value,
          }
        }
        updateAntragFields(props.user, requestData).then(data => {
          /**
           * Update product offer in redux store
           */
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

  /**
   * Method<br/>
   * Calculates the product offer.<br/>
   * **_Implementation:_** calls back-end (_{@link executeAntrag}_) to execute _Berechnen_ (_calculate_) activity.
   * If the response is successful then updates the product offer instance in the _redux_ store.<br/>
   * Sets state [isCalculate]{@link ActiveAntrag~isCalculate} to _true_ while while executing.
   *
   * @arg {object} newValues={}
   * Object of form
   * ```javascript
   * {
   *    <inputFieldName>: <inputFieldValue>
   * }
   * ```
   * that updates values of object [value]{@link ActiveAntrag~values} when calling the back-end. 
   */
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

  /**
   * Callback<br/>
   * **_Implementation:_** calls back-end (_{@link updateAntragFields}_) to update the values of the input fields.
   * If the response is successful then updates the product offer instance in the _redux_ store.
   *
   * @arg {object} newValues={}
   * Object of form
   * ```javascript
   * {
   *    <inputFieldName>: <inputFieldValue>
   * }
   * ```
   * that updates values of object [value]{@link ActiveAntrag~values} when calling the back-end. 
   */
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


  /**
   * Implements auto calculation of the product offer if the following criteria are met:
   * * the status of the product offer is _Neu_ (_new_)
   * * the input fields are valid ([validateFields]{@link ActiveAntrag~validateFields} returns _true_)
   * * the auto calculation is enabled
   * (state [autoCalculateDisabled]{@link ActiveAntrag~autoCalculateDisabled} is _false_)
   * * the product offer is not calculating now
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 5
   * @arg {string} antrag.status
   * prop [antrag.status]{@link ActiveAntrag}
   * @arg {object} values
   * state [values]{@link ActiveAntrag~values}
   * @arg {object} groups
   * state [groups]{@link ActiveAntrag~groups}
   */
  React.useEffect(() => {
    if (antrag.status === "Neu" && !autoCalculateDisabled && !isCalculate && validateFields()) {
      calculateAntrag()
    }
  }, [antrag.status, values, groups])


  /**
   * Event Handler<br/>
   * **_Event:_** change the value of an input field, which prop `inputTriggers == true`.<br/>
   * **_Implementation:_** calls the back-end (_{@link updateAntragFields}_) to update
   * the product offer instance with the actual values of the input fields.
   * On the successful response, it pushes the obtained from the back-end product offer instance to
   * [updateAntragFromBackend]{@link ActiveAntrag~updateAntragFromBackend}<br/>
   * Disables auto calculation
   * (sets state [autoCalculateDisabled]{@link ActiveAntrag~autoCalculateDisabled} to _false_)
   * while executing. 
   *
   * @arg {object} newValues={}
   * Object of form
   * ```javascript
   * {
   *    <inputFieldName>: <inputFieldValue>
   * }
   * ```
   * that updates values of object [value]{@link ActiveAntrag~values} when calling the back-end. 
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

  /**
   * Event Handler<br/>
   * **_Event:_** change the value of an input field, which prop `inputTriggers != true`.<br/>
   * **_Implementation:_** updates state [values]{@link ActiveAntrag~values} with the received _newValues_.
   *
   * @arg {object} newValues
   * Object of form
   * ```javascript
   * {
   *    <inputFieldName>: <inputFieldValue>
   * }
   * ```
   */
  const handleDataChanged = (newValues) => {
    // update field values
    setValues(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _calculate_ button.<br/>
   * **_Implementation:_** calls method [calculateAntrag]{@link ActiveAntrag~calculateAntrag}.
   *
   */
  const handleCalculateClick = () => {
    calculateAntrag()
  }
/*
  const validateActivityFields = () => {
    // check if activity selected
    if (!currentActivity) {
      return false
    }

    // build 'check' groups
    const fieldGroups = currentActivity.field_groups ? (
      currentActivity.field_groups.filter(group => activityGroups[group.name]).concat({name: 'fields'})
    ):(
      [{name: 'fields'}]
    )

    // check if required activity fields are filled correctely
    for (const group of fieldGroups) {
      for (const field of currentActivity[group.name].filter(field => field.fieldVisibilityType === 1)) {

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
*/

  /**
   * Callback<br/>
   * **_Implementation:_** sets state [currentActivity]{@link ActiveAntrag~currentActivity} to _ubdefined_.
   *
   */
  const handleActivityClose = () => {
    setActivity()
  }

  /**
   * Method<br/>
   * Searches for the activity with the specific _name_ in a product offer _instance_ and returns it.
   * 
   * @arg {object} instance
   * Object of a product offer instance. Could be the actual instance or updated one received from the back-end.
   * @arg {string} name
   * The name of a product offer activity
   * @returns {object | null}
   */
  const getActivityByName = (instance, name) => {
    if (instance.possible_activities) {
      for (const activity of instance.possible_activities) {
        if (activity.name === name) {
          return activity
        }
      }
    }

    return null
  }

  /**
   * Method<br/>
   * Executes specified _activity_ taking into account additional arguments.<br/>
   * **_Implementation:_**<br/> If `action == 'close'` then
   * sets state [currentActivity]{@link ActiveAntrag~currentActivity} to _undefined_.<br/>
   * If `action == 'upload'` then opens a [file upload dialog]{@link FileUploadDialog}.<br/>
   * Otherwise, calls back-end (_{@link executeAntrag}_) to execute specified _activity_.
   * If the response is successful then derives prop _postExecution_
   * from the received instance (if exists) or actual _activity_ argument.
   * In case of `postExecution == 'link'`, opens the received link in a new tab of the browser.
   * if not then updates the product offer instance in the _redux_ store with received one.<br/>
   * Sets state [isExecuting]{@link ActiveAntrag~isExecuting} to _true_ while while executing.
   * 
   * @arg {string} action='run'
   * Defines the flow of the execution of the activity.<br/>
   * Possible values: 'run' | 'close' | 'upload'
   * @arg {object} activity=[currentActivity]{@link ActiveAntrag~currentActivity}
   * The activity instance to be executed.
   * @arg {boolean} withFields=true
   * Flag that shows if states [activityGroups]{@link ActiveAntrag~activityGroups} and
   * [activityValues]{@link ActiveAntrag~activityValues} should be passed to the back-end
   * to execute the _activity_.
   */
  const executeActivity = (action='run', activity=currentActivity, withFields=true) => {

    if (action === 'close') {
      setActivity()
      return
    }

    if (action === 'upload') {
      setOpenUploadDialog(true)
      return
    }
    
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
      // post execution behavior
      // get current activity from response
      const updatedActivity = getActivityByName(data, activity.name)
      const postExecution = updatedActivity ? updatedActivity.postExecution : activity.postExecution

      switch (postExecution) {
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
        default:
          updateAntragFromBackend(data)
      }
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      //update state
      setExecute(false)
    })
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change state of a group _switch_ of an activity.<br/>
   * **_Implementation:_** Sets the value of prop _name_ of
   * state [activityGroups]{@link ActiveAntrag~activityGroups} to _value_.
   *
   * @arg {string} name
   * name of a current activity group of input fields
   * @arg {boolean} value
   * new value of the group visibility
   */
  const updateActivityGroupVisibility = (name, value) => {
    setActivityGroups((preValues) => ({
      ...preValues,
      [name]: value,
    }))
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change the value of an input field, which prop `inputTriggers == true`,
   * of the current activity.<br/>
   * **_Implementation:_**<br/> calls the back-end (_{@link updateAntragFields}_) to update
   * the product offer instance with the actual values of the input fields of the current activity.
   * On the successful response, it pushes the obtained from the back-end product offer instance to
   * [updateAntragFromBackend]{@link ActiveAntrag~updateAntragFromBackend}<br/>
   *
   * @arg {object} newValues={}
   * Object of form
   * ```javascript
   * {
   *    <inputFieldName>: <inputFieldValue>
   * }
   * ```
   * that updates values of object [activityValues]{@link ActiveAntrag~activityValues} when calling the back-end. 
   */
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

  /**
   * Event Handler<br/>
   * **_Event:_** change the value of an input field, which prop `inputTriggers != true`,
   * of the current activity.<br/>
   * **_Implementation:_** updates state [activityValues]{@link ActiveAntrag~activityValues}
   * with the received _newValues_.
   *
   * @arg {object} newValues
   * Object of form
   * ```javascript
   * {
   *    <inputFieldName>: <inputFieldValue>
   * }
   * ```
   */
  const handleActivityDataChanged = (newValues) => {
    setActivityValues(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  /**
   * Event Handler<br/>
   * **_Event:_** select an item of the activity navigation bar.<br/>
   * **_Implementation:_** if no activity of the product offer is executing
   * (states [isExecuting]{@link ActiveAntrag~isExecuting} and [isCalculate]{@link ActiveAntrag~isCalculate}
   * are _false_) then extracts an activity by its name from the possible activities of the product offer.
   * In case of the extracted activity does not requires additional inputs, the method executes it and
   * sets state [currentActivity]{@link ActiveAntrag~currentActivity} to _undefined_.<br/>
   * Otherwise, sets [currentActivity]{@link ActiveAntrag~currentActivity} to the extracted activity object.
   *
   * @arg {string} value
   * Object of form
   * The name of the selected activity.
   */
  const handleActivitySelect = (event, value) => {

    // check if activity is executing
    if (isExecuting || isCalculate) {
      return
    }

    const newActivity = antrag.possible_activities.filter(activity => activity.name === value)[0]

    // execute activity if it doesn't require inputs
    if (
      (!newActivity.actions || newActivity.actions.length === 0) &&
      (newActivity.fields.length === 0 && !("field_groups" in newActivity)) || 
      ("field_groups" in newActivity && newActivity.field_groups.length === 0)
    ) {
      setActivity()
      executeActivity('run', newActivity, false)
      return
    }
    
    // update current activity
    setActivity(newActivity)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _close_ button of the product offer card.<br/>
   * Implements animation of the card vanishing
   * by setting state [isVisible]{@link ActiveAntrag~isVisible} to _false_.
   */
  const handleCloseCard = () => {
    setIsVisible(false)
  }

  /**
   * Callback<br/>
   * **_Implementation:_** deletes the product offer by:
   * * removing the product offer instance from the _redux_ store
   * * removing the address lists, associated with the product offer, from the _redux_ store
   * * calling back-end (_{@link deleteAntrag}_) to remove the product offer in back-end  
   *
   */
  const handleDeleteCard = () => {
    props.clearAddressList(antrag.id)
    props.closeAntrag(props.index)

    // delete antrag in back-end store
    deleteAntrag(props.user, antrag.id).then(data => {
      console.log(data)
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _email_ button of the product offer card.<br/>
   * **Implementation:_** calls the back-end (_{@link getAntragEmail}_) for _.eml_ file
   * for the product offer and opens it in a new tab of the browser. 
   */
  const handleEmailClicked = () => {
    const payload = {
      parentId: antrag.id,
      action: "get",
    }

    getAntragEmail(props.user, payload).then(src => {
      props.updateAntrag()
      window.open(src, "_blank")
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Method<br/>
   * Checks if the current activity defines input fields of the specified type.
   *
   * @arg {string | null} activityType=null
   * Type of activity by its input fields.<br/>
   * Possible values:
   * * '_groups_' for grouped fields
   * * '_fields_' for ungrouped fields
   * * _null_ for any type of fields
   * @returns {boolean}
   */
  const isActivityOpen = (activityType=null) => {
    if (!currentActivity) {
      return false
    }

    const groupsExist = ("field_groups" in currentActivity) && currentActivity.field_groups.length > 0
    const fieldsExist = currentActivity.fields.filter(field => field.fieldVisibilityType < 3).length > 0

    switch (activityType) {
      case "groups":
        return groupsExist
      case "fields":
        return fieldsExist
      default:
        return groupsExist || fieldsExist
    }
  }

  /**
   * Toggles visibility of the [speedometer]{@link Speedometer} associated with the product offer card
   * by setting state [openSpeedometer]{@link ActiveAntrag~openSpeedometer}.
   * The conditions to show the speedometer are as follow:
   * * prop [antrag]{@link ActiveAntrag} holds property _speedometerValue_ with non-zero value
   * * the width of the screen is larger then 600px
   * * the product offer card is currently visible on the screen
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 6
   * @arg {boolean} isVisible
   * state [isVisible]{@link ActiveAntrag~isVisible}
   * @arg {number} scrollTop
   * prop [scrollTop]{@link ActiveAntrag}
   * @arg {number} antrag.speedometerValue
   * prop [antrag.speedometerValue]{@link ActiveAntrag}
   */
  React.useEffect(() => {
    if (!antrag.speedometerValue || !cardRef.current || window.innerWidth < 600) {
      setOpenSpeedometer(false)
      return
    }

    /**
     * Derives position of the product offer card.
     */
    const cardRect = cardRef.current.getBoundingClientRect()

    /**
     * The speedometer should be visible if the related card is within the current browser window.
     */
    const openSpeedometer = (props.index === 0) ? (
      // 1st card
      cardRect.bottom > 0
    ) : (
      // other cards
      cardRect.bottom > 0 && cardRect.top < window.innerHeight - speedometerSize
    )

    setOpenSpeedometer(isVisible && openSpeedometer)
  }, [isVisible, props.scrollTop, antrag.speedometerValue])

  
  /**
   * Derives the position and the height of the parent `<div>` element
   * that holds [speedometer]{@link Speedometer} connected to the product offer card.
   * The position could be one of the following:
   * * on the right margin of the page if the screen is wide enough
   * * within the layout of the product offer card
   *
   * The height of the parent `<div>` element equals to:
   * * the height of the speedometer if it is located on the page margin
   * * the sum of the speedometer height and the distance between the card bottom and
   * the _calculate_ button if it is located within the card
   *
   * @name useEffect
   * @function
   * @memberOf ActiveAntrag
   * @inner
   * @variation 7
   * @arg {number} scrollTop
   * prop [scrollTop]{@link ActiveAntrag}
   * @arg {object} currentActivity
   * state [currentActivity]{@link ActiveAntrag~currentActivity}
   * @arg {object} cardRef
   * ref [cardRef]{@link ActiveAntrag~cardRef}
   * @arg {object} calcRef
   * ref [calcRef]{@link ActiveAntrag~calcRef}
   */
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

              {/* DEBUG: broke antrag 
                <BrokeCard card="Antrag" />
              */}
              {/* Custom Tag */}
                <CustomTag
                  index={props.index}
                  id={antrag.id}
                  text={antrag.tag}
                />

                <Tooltip title={t("common:email")}>
                    <IconButton onClick={handleEmailClicked} aria-label="email">
                        <MailOutlineOutlinedIcon />
                    </ IconButton>
                </ Tooltip>

              {/* Clone Button */}
                {isCloneAvailable() &&
                <Tooltip title={t("common:copy")}>
                    <IconButton onClick={handleCloneClick}>
                        <FileCopyOutlinedIcon />
                    </IconButton>
                </ Tooltip>
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
                  field.fieldVisibilityType === 1 && field.fieldDataType === "Flag"
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
                    {antrag[group.name].filter(field => field.fieldVisibilityType < 3).length > 0 &&
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
                    field.fieldVisibilityType === 1 && field.fieldDataType === "Flag"
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
                          onCloseActivity={handleActivityClose}
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
                value={currentActivity && currentActivity.name}
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

ActiveAntrag.propTypes = {
  /**
   * The vertical `x` coordinate of the top of the current window
   */
  scrollTop: PropTypes.number,
  /**
   * The index of the product offer in the _redux_ store
   */
  index: PropTypes.number,
  /**
   * The product offer instance
   */
  antrag: PropTypes.object,
  /**
   * Object that contains the user credentials
   */
  user: PropTypes.object,
  /**
   * Object that contains _value lists_ stored in the _redux_
   */
  valueLists: PropTypes.object,
  /**
   * _Redux_ action that updates product offer instance in the store
   */
  updateAntrag: PropTypes.func,
  /**
   * _Redux_ action that adds a new product offer instance to the store
   */
  newAntrag: PropTypes.func,
  /**
   * _Redux_ action that removes a product offer instance from the store
   */
  closeAntrag: PropTypes.func,
  /**
   * _Redux_ action that removes from the store the address list associated with the current product offer
   */
  clearAddressList: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAntrag)
