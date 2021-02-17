
export const apiHost = process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : 'http://localhost:5000/'

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  return emailRegex.test(email)
}

export const validateJSONString = (string) => {
  try {
      JSON.parse(string)
  } catch (e) {
      return false
  }
  return true
}

export const validateSearchString = (string) => {
	const searchRegex = /\S+\s$/
	return searchRegex.test(string)
}

export const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const capitalizeFirstChar = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatRankWithSuffix = (number) => {
  const d = number % 100
  if (d > 3 && d < 21) return "th"
  switch (number % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
  }
}

export const typingTimeoutWithInputTrigger = (props, value, isValid=true) => {
  // define interval in ms that signals about stop of typing
  const typingDuration = 500

  return(
    setTimeout(() => {
      // check for input trigger and valid value
      if (props.data.inputTriggers && isValid) {
        // input trigger
        props.onInputTrigger({[props.data.name]: value})
      } else {
        // update antrag value
        props.onChange({[props.data.name]: value})
      }
    }, typingDuration)
  )
}
