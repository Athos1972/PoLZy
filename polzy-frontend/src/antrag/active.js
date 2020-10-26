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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, hideTime } from '../policy/CardStyles'
import { AntragTitle, InputField, ProgressButton } from './components'
import { removeAntrag, updateAntrag } from '../redux/actions'
import { executeAntrag } from '../api'

// set styles
const useStyles = makeStyles((theme) => ({
  flexContainerRight: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },

  premiumText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }

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
  const {fields} = antrag
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()

  const premium = fields.reduce((obj, field) => (field.name === "premium" ? field : obj), {})

  const [hidden, setHidden] = useState(false)
  const [values, setValues] = useState(
    fields.reduce((obj, field) => ({...obj, [field.name]: field.valueChosenOrEntered}), {})
  )
  const [currentActivity, setActivity] = useState('')
  const [activityValues, setActivityValues] = useState({})
  const [isWaiting, setWaiting] = useState(false)

  const validateFields = () => {
    // checks if all mandatory fields are filled
    for (const field of fields) {
      if (field.isMandatory && values[field.name] === '')
        return false
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
    setWaiting(true)
    // build request body
    const requestData = {
      id: antrag.id,
      activity: "Berechnen",
      values: values,
    }
    // calculate antrag
    executeAntrag(props.stage, requestData).then(data => {
      
      // update antrag
      updateAntrag(
        props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
      
      //update state
      setWaiting(false)
    })
  }

  const handleActivityExecute = () => {
    // switch calculate mode
    setWaiting(true)
    // build request body
    const requestData = {
      id: antrag.id,
      activity: currentActivity,
      values: activityValues,
    }
    // execute activity
    executeAntrag(props.stage, requestData).then(data => {
      
      // update antrag
      updateAntrag(
        props.index,
        {
          request_state: "ok",
          ...data,
        }
      )
      
      //update state
      setWaiting(false)
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

            {/* Flags */}
            <Grid container spacing={2}>
              {fields.filter((field) => (field.fieldDataType === "Flag")).map((field) => (
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
            <Grid container spacing={2}>
              {fields.filter((field) => (
                field.fieldDataType !== "Flag" && field.name !== "premium"
              )).map((field) => (
                <Grid item key={field.name} xs={12} md={4} lg={3}>
                  <InputField
                    data={field}
                    value={values[field.name]}
                    onChange={updateValue}
                  />
                </Grid>
              ))}
            </Grid>
            {antrag.status !== "Neu" && (
              <React.Fragment>

                {/* Premium Field */}
                <div className={classes.flexContainerRight}>
                  <Typography
                    className={classes.premiumText}
                    component="div"
                    variant="h5"
                  >
                    {`${t("antrag:premium")}: € ${premium.valueChosenOrEntered}`}
                  </Typography>
                </div>

                {/* Activity Select */}
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
              </React.Fragment>
            )}
          </CardContent>
        {/* Calculate Button */}
          {antrag.status === "Neu" && (
            <CardActions classes={{root: classes.flexContainerRight}} >
              <ProgressButton
                title={t('antrag:calculate')}
                loading={isWaiting}
                disabled={!validateFields()}
                onClick={handleCalculateClick}
              />
            </CardActions>
          )}
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
