import React from 'react'
import { 
  FormControl,
  FormHelperText,
  Tooltip,
  InputLabel,
  OutlinedInput,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format, parse } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import SearchField from './searchField'
import EnhancedTable from './enhancedTable'
import { getLocaleDateFormat, backendDateFormat } from '../dateFormat' 

// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    paddingBottom: theme.spacing(2),
  },

  infoText: {
    marginBottom: -theme.spacing(2),
  },

  warningText: {
    color: theme.palette.secondary.dark,
  },

  inputGroup: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },

  inputGroupContainer: {
    margin: 0,
    width: "100%",
  },

}))


/*
**  Text Input
*/
export function DataFieldText(props) {
  const classes = useStyles()
  const {id, data, value, onChange } = props
  const error = Boolean(data.errorMessage)

  const handleBlur = () => {
    if (Boolean(props.onBlur)) {
      props.onBlur(data.name)
    }
  }

  return (
    <FormControl
      classes={{root: classes.inputField}}
      variant="outlined"
      size="small"
      fullWidth
      required={data.isMandatory}
      disabled={props.disabled}
      error={error}
    >
      <InputLabel htmlFor={`${data.name}-${id}`}>
        {data.brief}
      </InputLabel>
      <OutlinedInput
        id={`${data.name}-${id}`}
        value={value}
        onChange={(e) => onChange({[data.name]: e.target.value})}
        onBlur={handleBlur}
        label={data.brief}
        endAdornment={props.endAdornment}
      />
      <FormHelperText>
        {data.errorMessage}
      </FormHelperText>
    </FormControl>
  )
}


/*
** Long Text Input
*/
export function DataFieldLongText(props) {
  const {id, data, value, onChange } = props

  const handleBlur = () => {
    if (Boolean(props.onBlur)) {
      props.onBlur(data.name)
    }
  }

  return (
    <TextField
      id={`${data.name}-${id}`}
      label={data.brief}
      multiline
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => onChange({[data.name]: e.target.value})}
      onBlur={handleBlur}
      required={data.isMandatory}
      size="small"
    />
  )
}

export function DataFieldTextBox(props) {
  const classes = useStyles()
  const {id, data, value, onChange } = props

  const handleBlur = () => {
    if (Boolean(props.onBlur)) {
      props.onBlur(data.name)
    }
  }

  return (
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
      <TextField
        id={`${data.name}-${id}`}
        multiline
        value={value}
        onChange={(e) => onChange({[data.name]: e.target.value})}
        onBlur={handleBlur}
        label={data.brief}
      />
    </FormControl>
  )
}

/*
**  Number Input
*/
export function DataFieldNumber(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const error = Boolean(data.errorMessage)

  const handleChange = (event) => {
    const newValue = event.target.value
    const re = /^[0-9\b]+$/

    if (newValue === '' || re.test(newValue)) {
      props.onChange({[data.name]: newValue})
    }
  }

  const handleBlur = () => {
    if (Boolean(props.onBlur)) {
      props.onBlur(data.name)
    }
  }

  return (
    <FormControl
      classes={{root: classes.inputField}}
      variant="outlined"
      size="small"
      fullWidth
      required={data.isMandatory}
      disabled={data.fieldType === 2}
      error={error}
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
      />
      <FormHelperText>
        {data.errorMessage}
      </FormHelperText>
    </FormControl>
  )
}


/*
**  Number Range
*/
export function DataFieldNumberRange(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const {t} = useTranslation('common')
  const [error, setError] = React.useState(false)
  const [helperText, setHelperText] = React.useState('')
  const [typingTimeout, setTypingTimeout] = React.useState(null)
  
  // range boundaries
  const min = Number(data.inputRange[1])
  const max = Number(data.inputRange[2])

  const validateValue = (value=value) => {
    return Boolean(value) && value >= min && value <= max
  }

  React.useEffect(() => {
    // check if error comes from backend
    if (Boolean(data.errorMessage)) {
      setHelperText(data.errorMessage)
      setError(true)
      return
    }

    // set default range message
    setHelperText(t('value.range') + ': ' + min + '-' + max)

    // check if value in range
    if ((Boolean(value) && value < min) || value > max) {
      setError(true)
      return
    } 

    // update error state
    if (!Boolean(value) || (value >= min && value <= max)) {
      setError(false)
    }
  }, [value])

  const handleChange = (event) => {
    //const newValue = valueInRange(event.target.value)
    const newValue = event.target.value

    // update value
    props.onChange({[data.name]: newValue})

    // check if typing is NOT finished
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // set timeout for typing finished
    setTypingTimeout(setTimeout(() => {
      // check for input trigger and valid value
      if (data.inputTriggers && validateValue(newValue)) {
        props.onInputTrigger({[data.name]: newValue})
      }
    }, 500))
  }

  const handleBlur = () => {
    if (Boolean(props.onBlur)) {
      props.onBlur(data.name)
    }
  }

  return (
    <FormControl
      classes={{root: classes.inputField}}
      variant="outlined"
      size="small"
      fullWidth
      required={data.isMandatory}
      error={error}
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
      <FormHelperText>
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}


/*
** Text Select with Filter
*/
export function DataFieldSelect(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const error = Boolean(data.errorMessage)

  const handleChange = (event, value) => {
    const newValue = {[data.name]: value}
    props.onChange(newValue)

    if (Boolean(props.onBlur)) {
      props.onBlur(data.name, newValue)
    }
  }

  return (
    <Autocomplete
      classes={{root: classes.inputField}}
      id={`${data.name}-${id}`}
      value={value === "" ? null : value}
      onChange={handleChange}
      options={data.inputRange}
      fullWidth
      size="small"
      renderInput={(params) => 
        <TextField {...params}
          label={data.brief}
          variant="outlined"
          required={data.isMandatory}
          error={error}
          helperText={data.errorMessage}
        />
      }
    />
  )
}


/*
** Date
*/
export function DataFieldDate(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const {i18n} = useTranslation()
  const error = Boolean(data.errorMessage)

  const getLocale = () => {
    switch (i18n.language) {
      case 'en':
        return enLocale
      default:
        return deLocale
    }
  }

  const handleChange = (date) => {
    if (isNaN(date) || date === null) {
      props.onChange({[data.name]: ''})
      return
    }

    const strValue = format(date, backendDateFormat)
    props.onChange({[data.name]: strValue})
  }

  const handleBlur = () => {
    if (Boolean(props.onBlur)) {
      props.onBlur(data.name)
    }
  }

  return (
    <FormControl
      classes={{root: classes.inputField}}
      fullWidth
      error={error}
    >
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={getLocale()}
      >
        <KeyboardDatePicker
          id={`${data.name}-${id}`}
          autoOk
          size="small"
          inputVariant="outlined"
          label={data.brief}
          format={getLocaleDateFormat()}
          value={parse(value, backendDateFormat, new Date())}
          onChange={handleChange}
          onBlur={handleBlur}
          required={data.isMandatory}
        />
      </MuiPickersUtilsProvider>
      <FormHelperText>
        {data.errorMessage}
      </FormHelperText>
    </FormControl>
  )
}


/*
** Switch
*/
export function DataFieldSwitch(props) {
  const {id, data, value } = props

  const handleChange = (event) => {
    const newValue = {[data.name]: event.target.checked}
    props.onChange(newValue)

    if (Boolean(props.onBlur)) {
      props.onBlur(data.name, newValue)
    }
  } 

  return (
    
      <FormControlLabel
        control={
          <Switch
            id={`${data.name}-${id}`}
            checked={value}
            onChange={handleChange}
            color="primary"
          />
        }
        label={data.brief}
      />

  )
}

/*
** Field with Tooltip
*/

export function TooltipField(props) {

  return(
    <React.Fragment>
      {props.tooltip ? (
        <Tooltip
          title={props.tooltip}
          placement="top"
        >
          {props.content}
        </Tooltip>
      ) : (
        props.content
      )}
    </React.Fragment>
  )
}


/*
** Data Field Mapper
*/
export function DataField(props) {
  const {data} = props

  //console.log('DATA FIELD')
  //console.log(props)

  if (data.inputRange && data.inputRange.length > 0) {
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
      case "TextBox":
        return <DataFieldLongText {...props} />
      default:
        return <DataFieldText {...props} />
    }
  }
}


/*
** Input Group
*/
export default function DataGroup(props) {
  const {title, fields, values, actions, ...commonProps} = props
  const classes = useStyles()

  const size = (screen) => {
    if (title.includes('suchen')) {
      return 12
    }

    switch (screen) {
      case 'lg':
        return 3
      case 'md':
        return 4
      default:
        return 12
    }
  }

  const getTableData = (dataString) => {
    //console.log('TABLE STRING:')
    //console.log(dataString)

    if (dataString === "None" || dataString === null) {
      return null
    }

    try {
      return JSON.parse(dataString)
    } catch(error) {
      console.log(error)
      return null
    }
  }

  //console.log('DATA GROUP')
  //console.log(props)

  return (
    <Paper 
      classes={{root: classes.inputGroup}}
      elevation={2}
    >

      {/* Title */}
      <Typography 
        gutterBottom
        variant="h5"
        component="p"
      >
        {title}
      </Typography>

      {/* Flags */}
      <Grid 
        classes={{root: classes.inputGroupContainer}}
        container
        spacing={2}
      >
        {fields.filter((field) => (
          field.fieldDataType === "Flag" && field.fieldType === 1
        )).map((field) => (
          <Grid
            item
            key={field.name}
            xs={6}
            md={4}
            lg={3}
          >
            <TooltipField
              tooltip={field.tooltip}
              content={
                <div>
                  <DataFieldSwitch 
                    {...commonProps}
                    data={field}
                    value={values[field.name]}
                  />
                </div>
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Input Fields */}
      <Grid 
        classes={{root: classes.inputGroupContainer}}
        container
        spacing={2}
      >
        {fields.filter((field) => (
          field.fieldDataType !== "Flag" && field.fieldType === 1 && 
          field.fieldDataType !== "SearchEndPoint" && field.fieldDataType !== "Table"
        )).map((field) => (
          <Grid 
            item
            key={field.name}
            xs={size('xs')}
            md={size('md')}
            lg={field.fieldDataType === "TextBox" ? 2*size('lg') : size('lg')}
          >
            <TooltipField
              tooltip={field.tooltip}
              content={
                <div>
                  <DataField
                    {...commonProps}
                    data={field}
                    value={values[field.name]}
                  />
                </div>
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Search Fields */}
      <Grid 
        classes={{root: classes.inputGroupContainer}}
        container
        spacing={2}
      >
        {fields.filter((field) => (field.fieldDataType === "SearchEndPoint" && field.fieldType === 1)).map((field) => (
          <Grid 
            item
            key={field.name}
            xs={12}
          >
            <SearchField
              {...commonProps}
              data={field}
              value={values[field.name]}
              address={values.address}
            />
          </Grid>
        ))}
      </Grid>

      {/* Table Fields */}
      <Grid 
        classes={{root: classes.inputGroupContainer}}
        container
        spacing={2}
      >
        {fields.filter((field) => (field.fieldDataType === "Table" && field.fieldType === 1)).map((field) => (
          <Grid 
            item
            key={field.name}
            xs={12}
          >
            <EnhancedTable
              name={field.name}
              title={field.brief}
              data={getTableData(field.valueChosenOrEntered)}
              value={values[field.name]}
              onChange={props.onGlobalChange}
              updateAntrag={props.updateAntrag}
              onCloseActivity={props.onCloseActivity}
            />
          </Grid>
        ))}
      </Grid>

      {/* Output Fields */}
      <Table>
        <TableBody>
          {fields.filter((field) => (field.fieldType === 2)).map((field) => (
            <TooltipField
            key={field.name}
              tooltip={field.tooltip}
              content={
                <TableRow hover>
                  <TableCell>{field.brief}</TableCell>
                  <TableCell>
                    {field.valueChosenOrEntered}
                  </TableCell>
                </TableRow>
              }
            />
          ))}
        </TableBody>
      </Table>
      {actions}
    </Paper>
  )
}