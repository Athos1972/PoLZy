
export const apiHost = process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : 'http://localhost:5000/'

/*
** validation
*/

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

export const validateIBAN = (string) => {
/*
 * Returns 1 if the IBAN is valid 
 * Returns FALSE if the IBAN's length is not as should be (for CY the IBAN Should be 28 chars long starting with CY )
 * Returns any other number (checksum) when the IBAN is invalid (check digits do not match)
 */
  const CODE_LENGTHS = {
    AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
    CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
    FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
    HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
    LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
    MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
    RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,
    AL: 28, BY: 28, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25,
    SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
  }
  // check country support
  if (!CODE_LENGTHS[string.toUpperCase().slice(0,2)]) {
    return false
  }

  const iban = string.toUpperCase().replace(/[^A-Z0-9]/g, '') // keep only alphanumeric characters
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/) // match and capture (1) the country code, (2) the check digits, and (3) the rest

  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
      return -1
  }
  
  // rearrange country code and check digits, and convert chars to ints
  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter) => (letter.charCodeAt(0) - 55))
  
  // return checksum
  const mod97 = () => {
    let checksum = digits.slice(0, 2)
    for (let offset = 2; offset < digits.length; offset += 7) {
      const fragment = String(checksum) + digits.substring(offset, offset + 7)
      checksum = parseInt(fragment, 10) % 97
    }
    return checksum
  }

  return mod97()
}


/*
** Formatting
*/
export const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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

export const parseJSONString = (string) => {
    // no parse needed
    if (typeof(string) === 'object') {
      return string
    }

    // empty values
    if (string === "None" || !Boolean(string)) {
      return null
    }

    try {
      return JSON.parse(string)
    } catch(error) {
      console.log(error)
      return null
    }
  }


/*
** Timeout
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


/*
** Get Data Field Value depending on its type
*/
export const getFieldValue = (field) => {

  // Boolean with related fields 
  if (field.fieldDataType === "FlagWithOptions" && field.relatedFields) {
    return {
      [field.name]: field.value === "True",
      ...field.relatedFields.reduce((result, subField) => ({
        ...result,
        ...getFieldValue(subField),
      }), {})
    }
  }

  // Boolean
  if (field.fieldDataType === "Flag" || field.fieldDataType === "FlagWithOptions") {
    return {[field.name]: field.value === "True"}
  }

  // empty values
  if (field.value === undefined || field.value === "None") {
    return {[field.name]: ""}
  }

  // other
  return {[field.name]: field.value}
}

