
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
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}