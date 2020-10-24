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
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { CardActiveHide, CardActive, CardTop, hideTime } from '../policy/CardStyles'
import { AntragTitle, InputField } from './components'
import { removeAntrag } from '../redux/actions'


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

  const [hidden, setHidden] = useState(false)
  const [values, setValues] = useState(
    //fields.map((field) => (field.valueChosenOrEntered))
    fields.reduce((obj, field) => ({...obj, [field.name]: field.valueChosenOrEntered}), {})
  )

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
            title={<AntragTitle product={antrag.product_line.name} />}
          />
          <CardContent>
            {/* Flags */}
            <Grid container spacing={2}>
              {fields.filter((field) => (field.fieldDataType === "Flag")).map((field) => (
                <Grid item key={field.name} xs={12} md={4} lg={3}>
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
                </Grid>
              ))}
            </Grid>

            {/* Other Fields */}
            <Grid container spacing={2}>
              {fields.filter((field) => (field.fieldDataType !== "Flag")).map((field) => (
                <Grid item key={field.name} xs={12} md={4} lg={3}>
                  <InputField
                    data={field}
                    value={values[field.name]}
                    onChange={updateValue}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              disabled={!validateFields()}
            >
              {t('antrag:calculate')}
            </Button>
          </CardActions>
        </React.Fragment>
      }
    />
  )
}

// connect to redux store
export default connect(null, {closeAntrag: removeAntrag})(ActiveAntrag)
