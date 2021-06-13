import React from 'react'
import PropTypes from 'prop-types'
import { 
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { typingTimeoutWithInputTrigger, validateIBAN } from '../utils'
import { inputFieldStyle, parseValue } from './util'

// Styles
const useStyles = makeStyles((theme) => (inputFieldStyle))

/**
 * Renders data field of type _Text_.
 *
 * @component
 * @category Data Fields
 */
function DataFieldText(props) {
  const classes = useStyles()

  /**
   * Field data extracted from _prop_ [data]{@link DataFieldText}
   *
   * @name data
   * @type {object}
   * @memberOf DataFieldText
   * @prop {string} name
   * the name of the field
   * @prop {string} brief
   * a short description of the field
   * @prop {bool} isMandatory
   * a boolean flag that shows if the field is mandatory
   * @prop {string} [errorMessage]
   * error message of the field retrieved from the back-end
   */
  const {id, data } = props
  
  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * An error message related to the data field.
   *
   * @name errorMessage
   * @default [data.errorMessage]{@link DataFieldText.data}
   * @prop {string} errorMessage - state
   * @prop {function} setError - setter
   * @type {state}
   * @memberOf DataFieldText
   * @inner
   */
  const [errorMessage, setError] = React.useState(data.errorMessage)
  /**
   * State<br/>
   * The value of the data field.
   *
   * @name value
   * @default [value]{@link DataFieldText}
   * @prop {string} value - state
   * @prop {function} setValue - setter
   * @type {state}
   * @memberOf DataFieldText
   * @inner
   */
  const [value, setValue] = React.useState(props.value)
  /**
   * State<br/>
   * A _setTimeout_ callback fired when a user stops typing in the field input element
   *
   * @name typingTimeout
   * @default undefined
   * @prop {object} typingTimeout - state
   * @prop {function} setTypingTimeout - setter
   * @type {state}
   * @memberOf DataFieldText
   * @inner
   */
  const [typingTimeout, setTypingTimeout ] = React.useState()

  /**
   * Updates sate [value]{@link DataFieldText~value} by
   * prop [value]{@link DataFieldText} every time it changes.
   *
   * @name useEffect
   * @function
   * @memberOf DataFieldText
   * @inner
   * @variant 1
   * @arg {string} value
   * prop [value]{@link DataFieldText}
   */
  React.useEffect(() => {
    setValue(props.value)
  }, [props.value])

  /**
   * Updates sate [errorMessage]{@link DataFieldText~errorMessage} by
   * prop [data.errorMessage]{@link DataFieldText~data} every time it changes.
   *
   * @name useEffect
   * @function
   * @memberOf DataFieldText
   * @inner
   * @variant 2
   * @arg {string} data.errorMessage
   * prop [data.errorMessage]{@link DataFieldText.data}
   */
  React.useEffect(() => {
    setError(data.errorMessage)
  }, [data.errorMessage])

  /**
   * Method<br/>
   * Validates the input value for a correct IBAN if the name of the field holds
   * string '_iban_' (case non sensitive)
   *
   * @function
   * @arg {string} [valueToValidate=[value]{@link DataFieldText~value}]
   * string value to be validated
   * @returns {bool} 
   */
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

  /**
   * Event Handler<br/>
   * **_Event:_** change input value.<br/>
   * **_Implementation:_**
   * * updates state [value]{@link DataFieldText~value} by the current input value
   * * updates state [typingTimeout]{@link DataFieldText~typingTimeout} using 
   * method [typingTimeoutWithInputTrigger]{@link module:datafieldUtils}
   */
  const handleChange = (event) => {
    //const newValue = valueInRange(event.target.value)
    const newValue = event.target.value

    // update value
    setValue(newValue)

    // clear current timeout if set
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

DataFieldText.propTypes = {
  /**
   * ID of the parent instance
   */
  id: PropTypes.string.isRequired,
  /**
   * Field data (see [data]{@link DataFieldText.data})
   */
  data: PropTypes.object.isRequired,
  /**
   * Value of the text field
   */
  value: PropTypes.string,
  /**
   * Boolean flag that shows if the field will be disabled
   */
  disabled: PropTypes.bool,
  /**
   * Callback fired on click or key-down event
   */
  onClick: PropTypes.func,
  /**
   * End [InputAdornment]{@link https://material-ui.com/api/input-adornment/#inputadornment-api}
   * for this text field
   */
  endAdornment: PropTypes.node,
}

export default DataFieldText
