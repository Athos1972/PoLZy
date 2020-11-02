import React from 'react'
import { 
  FormControl,
  FormHelperText,
  Tooltip,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format, parse } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    paddingBottom: theme.spacing(2),
  },

  infoText: {
    color: theme.palette.secondary.dark,
    marginBottom: -theme.spacing(2),
  }
}))


/*
**  Text Input
*/
export function DataFieldText(props) {
  const classes = useStyles()
  const {id, data, value, onChange } = props

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <FormControl
        classes={{root: classes.inputField}}
        variant="outlined"
        size="small"
        fullWidth
        required={data.isMandatory}
      >
        <InputLabel htmlFor={`${data.name}-${id}`}>
          {data.brief}
        </InputLabel>
        <OutlinedInput
          id={`${data.name}-${id}`}
          value={value}
          onChange={(e) => onChange(data.name, e.target.value)}
          label={data.brief}
        />
      </FormControl>
    </Tooltip>
  )
}


/*
**  Number Input
*/
export function DataFieldNumber(props) {
  const classes = useStyles()
  const {id, data, value } = props

  const handleChange = (e) => {
    const newValue = e.target.value
    const re = /^[0-9\b]+$/

    if (newValue === '' || re.test(newValue)) {
      props.onChange(data.name, newValue)
    }
  }

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <FormControl
        classes={{root: classes.inputField}}
        variant="outlined"
        size="small"
        fullWidth
        required={data.isMandatory}
      >
        <InputLabel htmlFor={`${data.name}-${id}`}>
          {data.brief}
        </InputLabel>
        <OutlinedInput
          id={`${data.name}-${id}`}
          value={value}
          onChange={handleChange}
          label={data.brief}
        />
      </FormControl>
    </Tooltip>
  )
}


/*
**  Number Range
*/
export function DataFieldNumberRange(props) {
  const classes = useStyles()
  const {id, data, value } = props
  
  // range boundaries
  const min = Number(data.inputRange[1])
  const max = Number(data.inputRange[2])

  const [message, setMessage] = React.useState('')

  const handleChange = (e) => {
    const newValue = e.target.value
    if (newValue < min) {
      setMessage(`lowest value is ${min}`)
      props.onChange(data.name, min)
    } else if (newValue > max) {
      setMessage(`Highest value is ${max}`)
      props.onChange(data.name, max)
    } else {
      setMessage('')
      props.onChange(data.name, newValue)
    }
  }

  const handleBlur = () => {
    if (value < min) {
      props.onChange(data.name, min)
    } else if (value > max) {
      props.onChange(data.name, max)
    }
  }

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <FormControl
        classes={{root: classes.inputField}}
        variant="outlined"
        size="small"
        fullWidth
        required={data.isMandatory}
      >
        <InputLabel htmlFor={`${data.name}-${id}`}>
          {data.brief}
        </InputLabel>
        <OutlinedInput
          id={`${data.name}-${id}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          label={data.brief}
          inputProps={{
            min: Number(data.inputRange[1]),
            max: Number(data.inputRange[2]),
            type: 'number',
          }}
        />
        {message !== "" && 
          <FormHelperText
            classes={{root: classes.infoText}}
            component="p"
          >
            {message}
          </FormHelperText>
        }
      </FormControl>
    </Tooltip>
  )
}


/*
** Text Select with Filter
*/
export function DataFieldSelect(props) {
  const classes = useStyles()
  const {id, data, value, onChange } = props

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <Autocomplete
        classes={{root: classes.inputField}}
        id={`${data.name}-${id}`}
        value={value}
        onChange={(e, v) => onChange(data.name, v)}
        options={data.inputRange}
        fullWidth
        size="small"
        required={data.isMandatory}
        renderInput={(params) => 
          <TextField {...params}
            label={data.brief}
            variant="outlined"
          />
        }
      />
    </Tooltip>
  )
}


/*
** Date
*/
export function DataFieldDate(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const {i18n} = useTranslation()

  const getLocale = () => {
    switch (i18n.language) {
      case 'en':
        return enLocale
      default:
        return deLocale
    }
  }

  const dateFormat = "dd.MM.yyyy"

  const handleChange = (date) => {
    const strValue = format(date, dateFormat)
    props.onChange(data.name, strValue)
  }

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <MuiPickersUtilsProvider 
        utils={DateFnsUtils}
        locale={getLocale()}
      >
        <KeyboardDatePicker
          classes={{root: classes.inputField}}
          id={`${data.name}-${id}`}
          autoOk
          variant="inline"
          inputVariant="outlined"
          label={data.brief}
          format="yyyy-MM-dd"
          size="small"
          value={parse(value, dateFormat, new Date())}
          onChange={handleChange}
          required={data.isMandatory}
        />
      </MuiPickersUtilsProvider>
    </Tooltip>
  )
}


/*
** Data Field Mapper
*/
export default function DataField(props) {
  const {data} = props

  if (data.inputRange.length > 0) {
    if (data.fieldDataType === "Zahl" && data.inputRange[0] === "range") {
      return <DataFieldNumberRange {...props} />
    } else {
      return <DataFieldSelect {...props} />
    }
  } else {
    switch (data.fieldDataType) {
      case "Zahl":
        return <DataFieldNumber {...props} />
      case "Datum":
        return <DataFieldDate {...props} />
      default:
        return <DataFieldText {...props} />
    }
  }
}