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
import clsx from 'clsx'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format, parse } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
//import { SearchPartner from './partner'

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
        disabled={data.fieldType === 2}
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

  const handleChange = (event) => {
    const newValue = event.target.value
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
        disabled={data.fieldType === 2}
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
  const {id, data, value, onChange } = props
  const {t} = useTranslation('common')
  
  // range boundaries
  const min = Number(data.inputRange[1])
  const max = Number(data.inputRange[2])

  const [helpTextWarning, setHelpTextWarning] = React.useState(false)

  const handleChange = (event) => {
    const newValue = event.target.value
    console.log(`Value: '${newValue}'`)

    // set help text color
    setHelpTextWarning((newValue !== '' && newValue < min) || newValue > max)

    // update value
    props.onChange(data.name, newValue)
  }

  const handleBlur = () => {
    if (value !== '' && value < min) {
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
        <FormHelperText
          classes={{root: clsx(classes.infoText, {[classes.warningText]: helpTextWarning})}}
          component="p"
        >
          {t('value.range') + ': ' + min + '-' + max}
        </FormHelperText>
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
        renderInput={(params) => 
          <TextField {...params}
            label={data.brief}
            variant="outlined"
            required={data.isMandatory}
          />
        }
      />
    </Tooltip>
  )
}


/*
** Date
*/
export const dateFormat = "dd.MM.yyyy"

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

  const handleChange = (date) => {
    const strValue = format(date, dateFormat)
    props.onChange(data.name, strValue)
  }

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <FormControl
        classes={{root: classes.inputField}}
        fullWidth
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
            format="yyyy-MM-dd"
            value={parse(value, dateFormat, new Date())}
            onChange={handleChange}
            required={data.isMandatory}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    </Tooltip>
  )
}


/*
** Switch
*/
export function DataFieldSwitch(props) {
  const {id, data, value, onChange } = props

  return (
    <Tooltip
      title={data.tooltip}
      placement="top"
    >
      <FormControlLabel
        control={
          <Switch
            id={`${data.name}-${id}`}
            checked={value}
            onChange={(e) => onChange(data.name, e.target.checked)}
            color="primary"
          />
        }
        label={data.brief}
      />
    </Tooltip>
  )
}


/*
** Data Field Mapper
*/
export const DataField = React.forwardRef(function DataField(props, ref) {
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
      /*
      case "SearchEndPoint":
        return <SearchPartner {...props} />
      */
      default:
        return <DataFieldText {...props} />
    }
  }
})


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
            key={field.name}
            item
            xs={6}
            md={4}
            lg={3}
          >
            <DataFieldSwitch 
              {...commonProps}
              data={field}
              value={values[field.name]}
            />
          </Grid>
        ))}
      </Grid>

      {/* Other Input Fields */}
      <Grid 
        classes={{root: classes.inputGroupContainer}}
        container
        spacing={2}
      >
        {fields.filter((field) => (
          field.fieldDataType !== "Flag" && field.fieldType === 1
        )).map((field) => (
          <Grid 
            item
            key={field.name}
            xs={size('xs')}
            md={size('md')}
            lg={size('lg')}
          >
            <DataField
              {...commonProps}
              data={field}
              value={values[field.name]}
            />
          </Grid>
        ))}
      </Grid>

      {/* Output Fields */}
      <Table>
        <TableBody>
          {fields.filter((field) => (field.fieldType === 2)).map((field) => (
            <TableRow hover>
              <TableCell>{field.brief}</TableCell>
              <TableCell>
                {field.valueChosenOrEntered}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {actions}
    </Paper>
  )
}