
import { createMuiTheme } from '@material-ui/core/styles'

const CardPalleteDefault = {
  cardBackground: {
    even: '#fff3e0',
    odd: '#e8f5e9',
  },
}

const paletteDefault = {
  palette: {
    ...CardPalleteDefault,
    primary: {
      light: '#5efc82',
      main: '#00c853',
      dark: '#009624',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffc246',
      main: '#ffc246',
      dark: '#c56200',
      contrastText: '#fff',
    },
  },
}

export const themeGreenOrange = createMuiTheme(paletteDefault)


export const polzyTheme = (theme) => {
  console.log('THEME:')
  console.log(theme)

  
  if (theme) {
    // update card background
    theme.palette = {
      ...CardPalleteDefault,
      ...theme.palette,
    }
    return createMuiTheme(theme)
  }

  return createMuiTheme(paletteDefault)
}