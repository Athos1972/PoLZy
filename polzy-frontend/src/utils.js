
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