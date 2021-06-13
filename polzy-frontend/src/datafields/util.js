/**
 * Data Field Utils
 *
 * @category Data Fields
 * @module datafieldUtil
 */

// input field style
export const inputFieldStyle = {
  inputField: {
    paddingBottom: 0,
  },
} 

// value parser
export const parseValue = (value) => {
  if (value) return value

  return ""
}


/**
 * Timeout
 *
 * @function
 * @arg {object} props
 * 
 */
export const typingTimeoutWithInputTrigger = (props, value, isValid=true) => {
  // define interval in ms that signals about stop of typing
  const typingDuration = 500

  return(
    setTimeout(() => {
      // check for input trigger and valid value
      if (props.onInputTrigger && props.data.inputTriggers && isValid) {
        // input trigger
        props.onInputTrigger({[props.data.name]: value})
      } else if (props.onChange) {
        // update antrag value
        props.onChange({[props.data.name]: value})
      }
    }, typingDuration)
  )
}