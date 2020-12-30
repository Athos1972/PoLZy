import React from 'react'
import { 
  FormControl,
  Select,
  MenuItem,
  Grid,
  OutlinedInput,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'


/*
** Language Options
*/
const languageOptions = [
  {
    language: "en",
    label: "English",
    isoCode: "GB",
  },
  {
    language: "de",
    label: "Deutsch",
    isoCode: "DE",
  },
  {
    language: "wi",
    label: "Wienerisch",
    isoCode: "AT",
  },
]

const useStyles = makeStyles({
  flagIcon: {
    minWidth: "56px",
  },

  noBorders: {
    root: {
      "& $notchedOutline": {
        border: "none",
      },
      "&:hover $notchedOutline": {
        border: "none",
      },
      "&$focused $notchedOutline": {
        border: "none",
      }
    },
    focused: {},
    notchedOutline: {},
  },
})

// bordless input field
const noBordersStyle = makeStyles((theme) => ({
  root: {
    "& $notchedOutline": {
      border: "none",
    },
    "&:hover $notchedOutline": {
      border: "none",
    },
    "&$focused $notchedOutline": {
      border: "none",
    }
  },
  focused: {},
  notchedOutline: {},
}))

/*
** Lenguage Selector Component
*/
export default function LanguageSelector(props) {

  const classes = useStyles()
  const noBorders = noBordersStyle()
  const {i18n} = useTranslation()

  const [value, setValue] = React.useState(() => {
    const currentOption = languageOptions.filter(option => option.language === i18n.language)
    if (currentOption.length === 1) {
      return currentOption[0]
    }

    return ''

  })


  // Country Flags
  // ISO 3166-1 alpha-2
  // No support for IE 11
  const getFlag = (isoCode) => {
    if (isoCode)
      return typeof String.fromCodePoint !== 'undefined'
        ? isoCode
            .toUpperCase()
            .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
        : isoCode

    return ''
  }

  const RenderOption = (props) => {
    return (
      <Grid container>
        <Grid item className={classes.flagIcon}>{getFlag(props.option.isoCode)}</Grid>
        {props.withLabel && 
          <Grid item>{props.option.label}</Grid>
        }
      </Grid>
    )
  }

  const handleChange = (event) => {
    setValue(event.target.value)
    i18n.changeLanguage(event.target.value.language)
  }

  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
    >
      <Select
        id="language"
        value={value}
        onChange={handleChange}
        renderValue={option => (
          <RenderOption
            option={option}
            withLabel={props.withLabel}
          />
        )}
        input={
          <OutlinedInput
            classes={props.noBorders ? noBorders : {}}
          />
        }
      >
        {languageOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            <RenderOption
              option={option}
              withLabel
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}