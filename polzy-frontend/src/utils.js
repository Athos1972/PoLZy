
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

export const formatRankWithSuffix = (i) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}
