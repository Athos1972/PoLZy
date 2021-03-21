import React from 'react'
import { 
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Tooltip,
  InputLabel,
  OutlinedInput,
  TextField,
  Switch,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  RadioGroup,
  Radio,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format, parse } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import htmlParse from 'html-react-parser'
import SelectField from './selectField'
import SearchField from './searchField'
import EnhancedTable from './enhancedTable'
import DataFieldSelect from './selectField'
import MappedImage from './mappedImage'
import { DocumentTable, AttachmentTable } from './fileTables'
import { LinearChart } from './charts'
import ExpandButton from '../components/expandButton'
import { getLocaleDateFormat, backendDateFormat } from '../dateFormat'
import { formatNumberWithCommas, typingTimeoutWithInputTrigger, parseJSONString, validateIBAN } from '../utils'

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
    backgroundColor: props => props.backgroundColor ? props.backgroundColor : "#fff",
  },

  inputGroupContainer: {
    margin: 0,
    width: "100%",
  },

  inputGroupSubtitle: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },

  flagLabel: {
    color: theme.palette.text.primary,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
    fontSize: "0.875rem",
  },

}))

const parseValue = (value) => {
  if (value) return value

  return ""
}


/*
**  Text Input
*/
export function DataFieldText(props) {
  const classes = useStyles()
  const {id, data } = props
  const [errorMessage, setError] = React.useState(data.errorMessage)
  const [value, setValue] = React.useState(props.value)
  const [typingTimeout, setTypingTimeout] = React.useState()

  React.useEffect(() => {
    setValue(props.value)
  }, [props.value])

  React.useEffect(() => {
    setError(data.errorMessage)
  }, [data.errorMessage])

  const validateValue = (valueToValidate=value) => {
    if (!valueToValidate || !data.name.toLowerCase().includes('iban')) {
      setError()
      return true
    }
    
    const ibanValidationResult = validateIBAN(valueToValidate)
    if (ibanValidationResult == 1) {
      setError()
      return true
    }

    if (!ibanValidationResult) {
      setError('Country code not supported')
    } else if (ibanValidationResult === -1) {
      setError('Invalid length')
    } else {
      setError('Invalid IBAN')
    }

    return false
  }

  const handleChange = (event) => {
    //const newValue = valueInRange(event.target.value)
    const newValue = event.target.value

    // update value
    setValue(newValue)

    // check if typing is NOT finished
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // set timeout for typing finished
    setTypingTimeout(typingTimeoutWithInputTrigger(props, newValue, validateValue(newValue)))
  }

  //console.log('Text Field:')
  //console.log(props)

  return (
    <FormControl
      classes={{root: classes.inputField}}
      variant="outlined"
      size="small"
      fullWidth
      required={data.isMandatory}
      disabled={props.disabled}
      error={Boolean(errorMessage)}
      onClick={props.onClick}
      onKeyDown={props.onClick}
    >
      <InputLabel htmlFor={`${data.name}-${id}`}>
        {data.brief}
      </InputLabel>
      <OutlinedInput
        id={`${data.name}`}
        value={parseValue(value)}
        onChange={handleChange}
        label={data.brief}
        endAdornment={props.endAdornment}
      />
      <FormHelperText>
        {errorMessage}
      </FormHelperText>
    </FormControl>
  )
}


/*
** Long Text Input
*/
export function DataFieldLongText(props) {
  const {id, data, value, onChange } = props

  return (
    <TextField
      id={`${data.name}`}
      label={data.brief}
      multiline
      fullWidth
      variant="outlined"
      value={value ? value : ""}
      onChange={(e) => onChange({[data.name]: e.target.value})}
      required={data.isMandatory}
      size="small"
    />
  )
}
/*
export function DataFieldTextBox(props) {
  const classes = useStyles()
  const {id, data, value, onChange } = props

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
        id={`${data.name}`}
        multiline
        value={value}
        onChange={(e) => onChange({[data.name]: e.target.value})}
        label={data.brief}
      />
    </FormControl>
  )
}
*/
/*
**  Number Input
*/
export function DataFieldNumber(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const [error, setError] = React.useState()

  React.useEffect(() => {
    setError(Boolean(data.errorMessage))
  }, [data.errorMessage])

  const handleChange = (event) => {
    const newValue = event.target.value
    const re = /^[0-9\b]+$/

    if (newValue === '' || re.test(newValue)) {
      props.onChange({[data.name]: newValue})
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
        id={`${data.name}`}
        value={value ? value : ""}
        onChange={handleChange}
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
  const {id, data } = props
  const {t} = useTranslation('common')
  const [error, setError] = React.useState(false)
  const [helperText, setHelperText] = React.useState('')
  const [typingTimeout, setTypingTimeout] = React.useState()
  const [value, setValue] = React.useState(props.value)
  
  // range boundaries
  const min = Number(data.inputRange[1])
  const max = Number(data.inputRange[2])

  const validateValue = (valueToValidate=value) => {
    return Boolean(valueToValidate) && valueToValidate >= min && valueToValidate <= max
  }

  React.useEffect(() => {
    setValue(props.value)
  }, [props])

  React.useEffect(() => {
    // check if error comes from backend
    if (Boolean(data.errorMessage)) {
      setHelperText(data.errorMessage)
      setError(true)
      return
    }

    // set default range message
    setHelperText(t('common:value.range') + ': ' + formatNumberWithCommas(min) + '-' + formatNumberWithCommas(max))

    // check if value in range
    if ((Boolean(value) && value < min) || value > max) {
      setError(true)
      return
    } 

    // update error state
    if (!Boolean(value) || (value >= min && value <= max)) {
      setError(false)
    }
  }, [value, data.errorMessage])

  const handleChange = (event) => {
    //const newValue = valueInRange(event.target.value)
    const newValue = event.target.value

    // update value
    setValue(newValue)

    // check if typing is NOT finished
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // set timeout for typing finished
    setTypingTimeout(typingTimeoutWithInputTrigger(props, newValue, validateValue(newValue)))
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
        id={`${data.name}`}
        value={parseValue(value)}
        onChange={handleChange}
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
** Date
*/
export function DataFieldDate(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const {i18n} = useTranslation()
  const [error, setError] = React.useState()

  React.useEffect(() => {
    setError(Boolean(data.errorMessage))
  }, [data.errorMessage])

  const getLocale = () => {
    switch (i18n.language) {
      case 'en':
        return enLocale
      default:
        return deLocale
    }
  }

  const handleChange = (date) => {
    if (isNaN(date) || date === null || date === '') {
      props.onChange({[data.name]: ''})
      return
    }

    const strValue = format(date, backendDateFormat)
    props.onChange({[data.name]: strValue})
  }

  const parseDateValue = () => {
    if (!value) {
      return null
    }

    return parse(value, backendDateFormat, new Date())
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
          id={`${data.name}`}
          autoOk
          size="small"
          inputVariant="outlined"
          label={data.brief}
          format={getLocaleDateFormat()}
          value={parseDateValue()}
          onChange={handleChange}
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
    
    // update on input trigger
    if (data.inputTriggers) {
      props.onInputTrigger(newValue)
    } 
  } 

  return (
    <FormControlLabel
      control={
        <Switch
          id={`${data.name}`}
          checked={Boolean(value)}
          onChange={handleChange}
          color="primary"
        />
      }
      label={htmlParse(data.brief)}
    />
  )
}


/*
** Flag with Radio Buttons
*/
export function DataFieldFlag(props) {
  const {id, data, value } = props
  const {t} = useTranslation('common')
  const classes = useStyles()

  const handleChange = (event) => {
    const newValue = {[data.name]: event.target.value}
    props.onChange(newValue)
    
    // update on input trigger
    if (data.inputTriggers) {
      props.onInputTrigger(newValue)
    } 
  } 

  return (
    <FormControl
      component="fieldset"
      required={data.isMandatory}
    >
      <FormLabel component="legend"/>
      <div className={classes.flagLabel}>
        {htmlParse(data.brief)}
      </div>
      <RadioGroup
        row
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel
          value="True"
          control={
            <Radio />
          }
          label={t("common:yes")}
        />
        <FormControlLabel
          value="False"
          control={
            <Radio />
          }
          label={t("common:no")}
        />
      </RadioGroup>
    </FormControl>
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
  const {title, fields, values, ...commonProps} = props
  const classes = useStyles({backgroundColor: props.backgroundColor})

  const [expanded, setExpanded] = React.useState(true)
  const [subtitles, setSubtitles] = React.useState([])

  const handleExpanded = () => {
    setExpanded(!expanded)
  }

  React.useEffect(() => {
    setSubtitles(props.subtitles ? [undefined, ...props.subtitles] : [undefined])
  }, [props.subtitles])

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

  //console.log('DATA GROUP:')
  //console.log(fields.filter((field) => (field.fieldDataType === "SearchEndPoint")))
  //console.log(props)
  //console.log(subtitles)

  return (
    <Paper 
      classes={{root: classes.inputGroup}}
      elevation={2}
    >

      <Grid
        container
        spacing={1}
      >

        {/* Expand Button */}
        <Grid item>
          <ExpandButton
            expanded={expanded}
            onClick={handleExpanded}
            size="small"
          />
        </Grid>

        {/* Title */}
        <Grid item>
          <Typography 
            gutterBottom
            variant="h5"
            component="p"
          >
            {title}
          </Typography>
        </Grid>
      </Grid>

      <Collapse
        in={expanded}
        timeout="auto"
      >

        {/* subsections */}
        {subtitles.map((subtitle, index) => (
          <Grid
            key={`${props.id}-section-${index}`}
            container
            direction="column"
          >

            {/* Subtitle */}
            {subtitle && 
              <Grid
                item
                xs={12}
              >
                <Typography 
                  className={classes.inputGroupSubtitle}
                  gutterBottom
                  variant="h5"
                  component="p"
                >
                  {subtitle}
                </Typography>
              </Grid>
            }

            {/* Flags */}
            <Grid 
              classes={{root: classes.inputGroupContainer}}
              item
              container
              spacing={2}
            >
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldDataType === "Flag" && field.fieldType === 1
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
              item
              container
              spacing={2}
            >
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldDataType !== "Flag" && field.fieldType === 1 && 
                field.fieldDataType !== "SearchEndPoint" && field.fieldDataType !== "Table" &&
                field.fieldDataType !== "FlagWithOptions" && field.fieldDataType !== "RadioFlagWithOptions"
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
              item
              container
              spacing={2}
            >
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldDataType === "SearchEndPoint" && field.fieldType === 1
              )).map((field) => (
                <Grid 
                  item
                  key={field.name}
                  xs={12}
                >
                  <SearchField
                    {...commonProps}
                    data={field}
                    value={values[field.name]}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Flag with Options */}
            <Grid 
              classes={{root: classes.inputGroupContainer}}
              item
              container
              spacing={2}
            >
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldType === 1 &&
                (field.fieldDataType === "FlagWithOptions" || field.fieldDataType === "RadioFlagWithOptions")
              )).map((field) => (
                <React.Fragment key={field.name}>
                  <Grid 
                    item
                    xs={12}
                  >
                    <TooltipField
                      tooltip={field.tooltip}
                      content={
                        <div>
                          {field.fieldDataType === "FlagWithOptions" ? (
                            <DataFieldSwitch 
                              {...commonProps}
                              data={field}
                              value={values[field.name]}
                            />
                          ) : (
                            <DataFieldFlag
                              {...commonProps}
                              data={field}
                              value={values[field.name]}
                            />
                          )}
                        </div>
                      }
                    />
                  </Grid>
                  <Grid item  xs={12}>
                    <Collapse
                      in={
                        (field.fieldDataType === "FlagWithOptions" && Boolean(values[field.name])) ||
                        (field.fieldDataType === "RadioFlagWithOptions" && values[field.name] === "True")
                      }
                      timeout="auto"
                      
                    >
                      <Grid container spacing={2}>
                        {Boolean(field.relatedFields) && field.relatedFields.map((optionField) => (
                          <Grid 
                            item
                            key={optionField.name}
                            xs={size('xs')}
                            md={size('md')}
                            lg={optionField.fieldDataType === "TextBox" ? 2*size('lg') : size('lg')}
                          >
                            <TooltipField
                              tooltip={optionField.tooltip}
                              content={
                                <div>
                                  <DataField
                                    {...commonProps}
                                    data={optionField}
                                    value={values[optionField.name] ? values[optionField.name] : null}
                                  />
                                </div>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Collapse>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>

            {/* Table Fields */}
            <Grid 
              classes={{root: classes.inputGroupContainer}}
              item
              container
              spacing={2}
            >
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldDataType === "Table" && field.fieldType === 1
              )).map((field) => (
                <Grid 
                  item
                  key={field.name}
                  xs={12}
                >
                  <EnhancedTable
                    name={field.name}
                    title={field.brief}
                    data={parseJSONString(field.valueChosenOrEntered)}
                    value={values[field.name]}
                    onChange={props.onGlobalChange}
                    updateAntrag={props.updateAntrag}
                    onCloseActivity={props.onCloseActivity}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Output Fields */}

            {/* Text */}
            <Grid item>
              <Table>
                <TableBody>
                  {fields.filter((field) => (
                    field.subsection === subtitle && field.fieldType === 2 && field.fieldDataType === "Text"
                  )).map((field) => (
                    <TooltipField
                    key={field.name}
                      tooltip={field.tooltip}
                      content={
                        <TableRow hover>
                          <TableCell>{field.brief}</TableCell>
                          <TableCell>
                            {htmlParse(field.valueChosenOrEntered)}
                            {/*field.valueChosenOrEntered.split("\n").map((line, index) => (
                              <div key={index}>
                                {line}
                              </div>
                            ))*/}
                          </TableCell>
                        </TableRow>
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            </Grid>

            {/* Mapped Images */}
            <Grid item>
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldType === 2 && field.fieldDataType === "Image"
              )).map((field) => (
                <MappedImage
                  key={field.name}
                  name={field.name}
                  title={field.brief}
                  image={field.icon}
                  tooltip={field.tooltip}
                  data={parseJSONString(field.valueChosenOrEntered)}
                />
              ))}
            </Grid>

            {/* Charts */}
            <Grid item>
              {fields.filter((field) => (
                field.subsection === subtitle && field.fieldType === 2 && field.fieldDataType === "Chart"
              )).map((field) => (
                <LinearChart
                  key={field.name}
                  name={field.name}
                  title={field.brief}
                  tooltip={field.tooltip}
                  data={parseJSONString(field.valueChosenOrEntered)}
                />
              ))}
            </Grid>

          {/* Document Fields */}
            <Grid item container spacing={2}> 
              <Grid item xs={12}>
                {fields.filter((field) => (
                  field.subsection === subtitle && field.fieldType === 2 && field.fieldDataType === "Documents"
                )).map((field) => (
                  <DocumentTable
                    key={field.name}
                    parentId={props.id}
                    name={field.name}
                    title={field.brief}
                    data={parseJSONString(field.valueChosenOrEntered)}
                  />
                ))}
              </Grid>

              <Grid item xs={12}>
                {fields.filter((field) => (
                  field.subsection === subtitle && field.fieldType === 2 && field.fieldDataType === "Attachments"
                )).map((field) => (
                  <AttachmentTable
                    key={field.name}
                    name={field.name}
                    title={field.brief}
                    data={parseJSONString(field.valueChosenOrEntered)}
                    onDelete={props.onInputTrigger}
                  />
                ))}
              </Grid>
            </Grid>

          </Grid>
        ))}

        {/*actions*/}
      </Collapse>
    </Paper>
  )
}