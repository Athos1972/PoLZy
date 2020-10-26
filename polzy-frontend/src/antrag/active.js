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
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, hideTime } from '../policy/CardStyles'
import { AntragTitle, InputField } from './components'
import { removeAntrag, updateAntrag } from '../redux/actions'
import { calculateAntrag } from '../api'

// set styles
const useStyles = makeStyles((theme) => ({
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  const {fields} = antrag
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()

  const newAntrag = (antrag.status === "Neu")
  const premium = fields.reduce((obj, field) => (field.name === "premium" ? field : obj), {})

  console.log('PREMIUM')
  console.log(premium)

  const [hidden, setHidden] = useState(false)
  const [values, setValues] = useState(
    //fields.map((field) => (field.valueChosenOrEntered))
    fields.reduce((obj, field) => ({...obj, [field.name]: field.valueChosenOrEntered}), {})
  )
  const [isCalculate, setCalculate] = useState(false)

  const validateFields = () => {
    // checks if all mandatory fields are filled
    for (const field of fields) {
      if (field.isMandatory && values[field.name] === '')
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
    setCalculate(true)
    // build request body
    const requestData = {
      id: antrag.id,
      values: values,
    }

    calculateAntrag(props.stage, requestData).then(data => {
      
      // update antrag
      updateAntrag(
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
                <Grid item key={field.name} xs={12} md={4} lg={3}>
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
                          disabled={!newAntrag}
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
                    disabled={!newAntrag}
                  />
                </Grid>
              ))}
            </Grid>
            {/* Premium Field */}
            <Tooltip
              title={premium.tooltip}
              placement="top"
            >
              <Typography
                component="p"
                variant="h5"
              >
                {`${premium.brief}: ${premium.premium}`}
              </Typography>
            </Tooltip>
          </CardContent>
          {newAntrag && (
            <CardActions classes={{root: classes.actionContainer}} >
              <Button
                size="small"
                color="primary"
                disabled={!validateFields()}
                onClick={handleCalculateClick}
              >
                {t('antrag:calculate')}
              </Button>
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
