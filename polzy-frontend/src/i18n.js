import i18n from "i18next";
import { initReactI18next } from "react-i18next"
import en from './strings/en.json'
import de from './strings/de.json'
import wi from './strings/wi.json'

// the translations
const resources = {
  en: en,
  de: de,
  wi: wi
}

const userLocale = () => {
  const locale = window.navigator.userLanguage || window.navigator.language
  try {
    const lng = locale.slice(0,2) || 'de'
    return lng
  } catch (error) {
    return 'de'
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: userLocale(),

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n