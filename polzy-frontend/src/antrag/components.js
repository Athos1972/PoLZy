import React from 'react'
import { 
  Typography,
  FormControl,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

// Styles
const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -(theme.spacing(4) - theme.spacing(1)) / 2,
    marginLeft: -theme.spacing(4) / 2,
  }
}))


/*
**   Title of Antrag Card
*/
export function AntragTitle(props) {
  const {t} = useTranslation('antrag')
  const {product} = props
  
  return(
    <Typography
      component="p"
      variant="h5"
    >
      {t('fast.offer') + ': ' + product}
    </Typography>
  )
}


/*
**  Card Input Field
*/
export function InputField(props) {
  const {data, value, onChange } = props

  const handleBlur = () => {
    const min = Number(data.inputRange[1])
    const max = Number(data.inputRange[2])
    if (value < min) {
      onChange(data.name, data.fieldDataType, min)
    } else if (value > max) {
      onChange(data.name, data.fieldDataType, max)
    }
  }

  const withAdornment = /^Euro/.test(data.valueChosenOrEnteredOutput)

  return(
    <React.Fragment>
      <Tooltip
        title={data.tooltip}
        placement="top"
      >
        <FormControl
          variant="outlined"
          size="small"
          fullWidth
          required={data.isMandatory}
        >
          <InputLabel htmlFor={`${data.name}`}>
            {data.brief}
          </InputLabel>
          {data.inputRange.length > 0 ? (
            <React.Fragment>
              {data.fieldDataType === "Zahl" && data.inputRange[0] === "range" ? (
                <OutlinedInput
                  id={data.name}
                  value={value}
                  onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
                  onBlur={handleBlur}
                  label={data.brief}
                  inputProps={{
                    min: Number(data.inputRange[1]),
                    max: Number(data.inputRange[2]),
                    type: 'number',
                  }}
                />
              ) : (
                <Select
                  id={data.name}
                  value={value}
                  onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
                  label={data.brief}
                  renderValue={(v) => (withAdornment ? `€ ${v}` : v)}
                >
                  {data.inputRange.map((itemValue, index) => (
                    <MenuItem key={index} value={itemValue}>
                      {itemValue}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </React.Fragment>
          ) : (
            <OutlinedInput
              id={data.name}
              value={value}
              onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
              label={data.brief}
            />
          )}
        </FormControl>
      </Tooltip>
    </React.Fragment>
  )
}


/*
**  Button with progress 
*/
export function ProgressButton(props) {
  const {title, loading, disabled, onClick } = props
  const classes = useStyles()

  return(
    <div style={{position: "relative"}}>
      <Button 
        variant="contained"
        color="primary"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {title}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  )
}