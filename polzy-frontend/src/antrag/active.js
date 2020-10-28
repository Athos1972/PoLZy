import React, { useState, useEffect } from 'react'
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  BottomNavigation,
  BottomNavigationAction,
  SvgIcon,
  Paper,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, hideTime } from '../policy/CardStyles'
import { AntragTitle, InputField, ProgressButton } from './components'
import { removeAntrag, updateAntrag } from '../redux/actions'
import { executeAntrag } from '../api'
import { ReactComponent as Calculate } from '../Icons/calculate.svg'
import { ReactComponent as Pdf } from '../Icons/pdf.svg'
import { ReactComponent as Partnersearch } from '../Icons/partnersearch.svg'

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

function ActivityIcon(props) {
  const {icon} = props

  switch (icon) {
    case 'calculate.svg':
      return (
        <SvgIcon viewBox="0 0 512 512">
          <Calculate />
        </SvgIcon>
      )
    case 'pdf.svg':
      return (
        <SvgIcon viewBox="0 0 48 48">
          <Pdf />
        </SvgIcon>
      )
    case 'partnersearch.svg':
      return (
        <SvgIcon viewBox="0 0 964.8 964.8">
          <Partnersearch />
        </SvgIcon>
      )
    default:
      return <CloseIcon />
  }
}

function ActiveAntrag(props) {
  const {antrag} = props
  //const {fields} = antrag
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()

  //const premium = fields.reduce((obj, field) => (field.name === "premium" ? field : obj), {})

  const [hidden, setHidden] = useState(false)

  // groups state
  const getGroups = () => {
    return antrag.field_groups.reduce((result, group) => ({
      ...result,
      [group.name]: group.valueChosenOrEntered === "True",
    }), {})
  }
  const [groups, setGroups] = useState(getGroups)

  // values state
  const getValues = () => {
    return antrag.field_groups.filter(group => groups[group.name]).reduce((result, group) => ({
      ...result,
      ...antrag[group.name].reduce((groupFields, field) => ({
        ...groupFields,
        [field.name]: field.fieldDataType === "Flag" ? field.valueChosenOrEntered === "True" : field.valueChosenOrEntered,
      }), {}),
    }), {})
  }
  const [values, setValues] = useState(getValues)

  // other states
  const [currentActivity, setActivity] = useState('')
  const [activityValues, setActivityValues] = useState({})
  const [isCalculate, setCalculate] = useState(false)
  const [isWaiting, setWaiting] = useState(false)

  const validateFields = () => {
    // checks if all mandatory fields are filled
    for (const group of antrag.field_groups.filter(group => (group.valueChosenOrEntered === "True"))) {
      for (const field of antrag[group.name]) {
        if (field.isMandatory && values[field.name] === '')
          return false
      }
    }
    return true
  }

  const validateActivity = () => {
    // check if activity selected
    if (currentActivity === '')
      return false
    // check if required activity fields are filled
    const selectedActivity = antrag.possible_activities.reduce((obj, field) => (field.name === currentActivity ? field : obj), {})
    for (const field of selectedActivity.fields) {
      if(field.isMandatory && activityValues[field.name] === '')
        return false
    }
    return true
  }

  const handleCloseClick = () => {
    setHidden(true)
    setTimeout(() => {props.closeAntrag(props.index)}, hideTime)
  }

  const updateGroupVisibility = (name, value) => {
    setGroups((preValues) => ({
      ...preValues,
      [name]: value,
    }))
  }

  const updateValue = (name, type, value) => {
    const re = /^[0-9\b]+$/
    if (type !== 'Zahl' || value === '' || re.test(value)) {
      setValues((preValues) => ({
        ...preValues,
        [name]: value,
      }))
    }
  }

  const handleCalculateClick = () => {
    // switch calculate mode
    setCalculate(true)

    // build request body
    const requestData = {
      id: antrag.id,
      activity: "Berechnen",
      values: antrag.field_groups.filter(group => groups[group.name]).reduce((result, group) => ({
        ...result,
        ...antrag[group.name].reduce((groupFields, field) => ({
          ...groupFields,
          [field.name]: values[field.name],
        }), {}),
      }), {}),
    }


    // calculate antrag
    executeAntrag(props.stage, requestData).then(data => {
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
    })
  }

  const handleActivityExecute = () => {
    // switch calculate mode
    setWaiting(true)
    // build request body
    const requestData = {
      id: antrag.id,
      activity: currentActivity,
      values: currentActivity === "Berechnen" ? values : activityValues,
    }
    // execute activity
    executeAntrag(props.stage, requestData).then(data => {
      
      // update antrag
      props.updateAntrag(
        props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
      
      //update state
      setWaiting(false)
      setActivity('')
    })
  }


  return(
    <AntragCard
      hidden={hidden}
      content={
        <React.Fragment>
          <CardTop
            action={
              <Tooltip title={t("common:close")}>
                <IconButton 
                  onClick={handleCloseClick}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
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
                {antrag.field_groups.filter(group => groups[group.name]).map(group => (
                  <Paper 
                    classes={{root: classes.fieldGroup}}
                    elevation={2}
                  >
                    {/* Title */}
                    <Typography gutterBottom variant="h5" component="p">
                      {group.tooltip}
                    </Typography>

                    {/* Flags */}
                    <Grid classes={{root: classes.fieldGroupCntainer}} container spacing={2}>
                      {antrag[group.name].filter((field) => (field.fieldDataType === "Flag")).map((field) => (
                        <Grid item key={field.name} xs={6} md={4} lg={3}>
                          <Tooltip
                            title={field.tooltip}
                            placement="top"
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={values[field.name]}
                                  onChange={(e) => updateValue(field.name, field.fieldDataType, e.target.checked)}
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

                    {/* Other Fields */}
                    <Grid classes={{root: classes.fieldGroupCntainer}} container spacing={2}>
                      {antrag[group.name].filter((field) => (field.fieldDataType !== "Flag")).map((field) => (
                        <Grid item key={field.name} xs={12} md={4} lg={3}>
                          <InputField
                            id={antrag.id}
                            data={field}
                            value={values[field.name]}
                            onChange={updateValue}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
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
                  {`${t("antrag:premium")}: € ${antrag.fields[0].valueChosenOrEntered}`}
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

          {/* Activity Select */}
          {/*antrag.status !== "Neu" &&
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    <InputLabel htmlFor="activity">
                      {t("common:action")}
                    </InputLabel>
                    <Select
                      id="activity"
                      value={currentActivity}
                      onChange={(e) => setActivity(e.target.value)}
                      label={t("common:action")}
                    >
                      {antrag.possible_activities.map((activity, index) => (
                        <MenuItem key={index} value={activity.name}>
                          {activity.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <ProgressButton
                    title={t('common:execute')}
                    loading={isWaiting}
                    disabled={currentActivity === 'Berechnen' ? !validateFields() : !validateActivity()}
                    onClick={handleActivityExecute}
                  />
                </Grid>
              </Grid>
            </CardContent>
          */}

          {/* bottom navigation */}
          {antrag.status !== "Neu" &&
            <CardContent>
              <BottomNavigation value={currentActivity} onChange={(e, v) => setActivity(v)} >
                {antrag.possible_activities.map((activity, index) => (

                    <BottomNavigationAction
                      key={index}
                      label={activity.name}
                      value={activity.name}
                      icon={<ActivityIcon icon={activity.icon} />}
                    >
                      <Tooltip
                        title={activity.description}
                        placement="top"
                      />
                    </BottomNavigationAction>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAntrag)
