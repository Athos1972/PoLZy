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
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, hideTime } from '../styles/cards'
import { AntragTitle } from './components'
import ProgressButton from '../components/progressButton'
import DataGroup from '../components/dataFields'
import { removeAntrag, updateAntrag, addAntrag } from '../redux/actions'
import { executeAntrag, cloneAntrag, updateAntragFields } from '../api'
import { ActivityIcon } from '../components/icons'
//import PartnerCard from './partner'

// set styles
const useStyles = makeStyles((theme) => ({
  flexContainerVertical: {
    display: 'flex',
    flexDirection: 'column',
  },

  flexContainerRight: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },

  fieldGroup: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },

  fieldGroupCntainer: {
    margin: 0,
    width: "100%",
  },

  premiumText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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

function ActiveAntrag(props) {
  const {antrag} = props
  const {t, i18n} = useTranslation('common', 'antrag')
  const classes = useStyles()

  const [hidden, setHidden] = useState(false)

  // groups state
  const getGroups = (obj) => {
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      [group.name]: group.valueChosenOrEntered === "True",
    }), {})
  }
  
  // values state
  const getValues = (obj) => {
    const commonFields = obj.fields.reduce((result, field) => ({
      ...result,
      [field.name]: field.fieldDataType === "Flag" ? (
        field.valueChosenOrEntered === "True"
      ) : (
        field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
      ),
    }), {})
    return obj.field_groups.reduce((result, group) => ({
      ...result,
      ...obj[group.name].reduce((groupFields, field) => ({
        ...groupFields,
        [field.name]: field.fieldDataType === "Flag" ? field.valueChosenOrEntered === "True" : (
          field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
        ),
      }), {}),
    }), {...commonFields})
  }

  const [groups, setGroups] = useState({...getGroups(antrag)})
  const [values, setValues] = useState({...getValues(antrag)})

  React.useEffect(() => {
    setGroups({...getGroups(antrag)})
    setValues({...getValues(antrag)})
  }, [antrag])
  

  // other states
  const [currentActivity, setActivity] = useState(null)
  const [activityGroups, setActivityGroups] = useState({})
  const [activityValues, setActivityValues] = useState({})
  const [isCalculate, setCalculate] = useState(false)
  const [isExecuting, setExecute] = useState(false)

  const getPremium = () => {
    for (const field of antrag.fields) {
      if (field.name === 'premium') {
        return field.valueChosenOrEntered === "None" ? ("") : (field.valueChosenOrEntered)
      }
    }
    
    return ""
  }

  const validateFields = () => {
    // checks if all mandatory fields are filled
    for (const group of antrag.field_groups.filter(group => groups[group.name])) {
      for (const field of antrag[group.name]) {
        //console.log(`${field.isMandatory ? "+" : "-"} ${field.name}: ${values[field.name]}`)
        if (field.isMandatory && (values[field.name] === "" || values[field.name] === null))
          return false
      }
    }
    return true
  }

  const fieldByName = (name) => {
    // returns antrag field by its name

    for (const group of antrag.field_groups.filter(group => groups[group.name])) {
      for (const field of antrag[group.name]) {
        if (field.name === name)
          return field
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
    cloneAntrag(props.stage, antrag.id).then(data => {
      props.newAntrag(
        {
          request_state: "ok",
          stage: props.stage,
          ...data,
        }
      )
    })
  }

  const updateGroupVisibility = (name, value) => {
    setGroups((preValues) => ({
      ...preValues,
      [name]: value,
    }))
  }

  const handleDataChanged = (newValues) => {
    //check if fields should be updated
    Object.keys(newValues).forEach(key => {
      const field = fieldByName(key)
      if (field && field.inputTriggers) {
        // update antrag
        const requestData = {
          id: antrag.id,
          values: {
            ...groups,
            ...values,
            ...newValues,
          }
        }

        // update antrag fields
        updateAntragFields(i18n.language, props.stage, requestData).then(data => {
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

    })

    // update values
    setValues(preValues => ({
      ...preValues,
      ...newValues,
    }))

  }

  const handleCalculateClick = () => {
    // switch calculate mode
    setCalculate(true)

    // build request body
    const requestData = {
      id: antrag.id,
      activity: "Berechnen",
      values: {
        ...groups,
        ...values,
      }
    }

    // calculate antrag
    executeAntrag(i18n.language, props.stage, requestData).then(data => {
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

  const validateActivityFields = () => {
    // check if activity selected
    if (currentActivity === null)
      return false
    // check if required activity fields are filled
    for (const field of currentActivity.fields) {
      if(field.isMandatory && activityValues[field.name] === '')
        return false
    }
    return true
  }

  const executeActivity = (activity) => {
    // switch calculate mode
    setExecute(true)
    // build request body
    const requestData = {
      id: antrag.id,
      activity: activity,
      values: {
        ...activityGroups,
        ...activityValues,
      },
    }

    // execute activity
    executeAntrag(i18n.language, props.stage, requestData).then(data => {
      
      // check response
      if (activity === "Drucken" || activity === "Deckungsuebersicht") {
        //console.log(data)
        window.open(`http://localhost:5000/files/${data.link}`, "_blank")
      } else if (activity === "Antrag erzeugen") {
        //console.log(data)
        window.open(data.link, "_blank")
      } else {
        // update antrag
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
      setActivity(null)

    }).catch(error => {
      console.log(error)
      //update state
      setExecute(false)
    })
  }

  const updateActivityGroupVisibility = (name, value) => {
    setActivityGroups((preValues) => ({
      ...preValues,
      [name]: value,
    }))
  }

  const handleActivityDataChanged = (newValues) => {
    setActivityValues(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const handleActivitySelect = (event, value) => {
    // check if the same acticvity selected
    //if (value === currentActivity.name) {
    //  return
    //}

    // check if activity is executing
    if (isExecuting || isCalculate) {
      return
    }

    const newActivity = antrag.possible_activities.filter(activity => activity.name === value)[0]

    // update current activity
    setActivity(newActivity)

    // execute activity if doesn't require inputs
    if (
      (newActivity.fields.length === 0 && !("field_groups" in newActivity)) || 
      ("field_groups" in newActivity && newActivity.field_groups.length === 0)
    ) {
      executeActivity(value)
      return
    }

    // update activity values
    let newActivityValues
    if ("field_groups" in newActivity) {
      const newGroups = getGroups(newActivity)
      setActivityGroups(newGroups)
      newActivityValues = {...getValues(newActivity)}
    } else {
      newActivityValues = {...newActivityValues, ...newActivity.fields.reduce((result, field) => ({
        ...result,
        [field.name]: field.fieldDataType === "Flag" ? field.valueChosenOrEntered === "True" : (
          field.valueChosenOrEntered === "None" ? "" : field.valueChosenOrEntered
        ),
      }), {})}
    }

    // update address values
    if (newActivity.name === "VN festlegen") {
      const addressKeys = [
        "country",
        "postCode",
        "city",
        "street",
        "streetNumber",
        "houseNumber",
      ]

      newActivityValues = {
        ...newActivityValues,
        ...addressKeys.reduce((result, key) => ({...result, [key]: values[key]}), {}),
        addressNumber: values.addressNumber,
        address: addressKeys.filter(key => values[key] !== '').reduce((label, key) => ([...label, values[key]]), []).join(' ')
      }
    }
    setActivityValues({...newActivityValues})
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

  //console.log("Activity Values:")
  //console.log(activityValues)
  //console.log("ANtrag Partner:")
  //console.log(partner)
  //console.log("GROUPS:")
  //console.log(groups)
  //console.log('VALUES:')
  //console.log(values)
  
  return(
    <AntragCard
      hidden={hidden}
      content={
        <React.Fragment>
          <CardTop
            action={
              <React.Fragment>
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
                {antrag.field_groups.map(group => (
                  <Collapse
                    key={group.name}
                    in={groups[group.name]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <DataGroup 
                      id={antrag.id}
                      title={group.tooltip}
                      fields={antrag[group.name]}
                      values={values}
                      stage={props.stage}
                      onChange={handleDataChanged}
                    />
                  </Collapse>
                ))}
            </div>

            {/* Premium Field */}
            {antrag.status !== "Neu" && (
              <div className={classes.flexContainerRight}>
                <Typography
                  className={classes.premiumText}
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
                      />
                    </Collapse>
                  ))}
              </div>
              <div className={classes.flexContainerRight} >
                <ProgressButton
                  title={t('common:execute')}
                  loading={isExecuting}
                  disabled={!validateActivityFields()}
                  onClick={(e) => executeActivity(currentActivity.name)}
                />
              </div>
            </React.Fragment>
          }
          {currentActivity !== null && currentActivity.fields.length > 0 &&
            <DataGroup
              stage={props.stage}
              id={antrag.id}
              title={currentActivity.description}
              fields={currentActivity.fields}
              values={activityValues}
              onChange={handleActivityDataChanged}
              onSelect={handlePartnerSelect}
              actions={
                <div className={classes.flexContainerRight} >
                  <ProgressButton
                    title={t('common:execute')}
                    loading={isExecuting}
                    disabled={!validateActivityFields()}
                    onClick={(e) => executeActivity(currentActivity.name)}
                  />
                </div>
              }
            />
          }

          {/* bottom navigation */}
          {antrag.status !== "Neu" &&
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
          }
        </React.Fragment>
      }
    />
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  stage: state.user.stage,
})

const mapDispatchToProps = {
  closeAntrag: removeAntrag,
  updateAntrag: updateAntrag,
  newAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAntrag)
