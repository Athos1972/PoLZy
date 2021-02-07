
import { createMuiTheme } from '@material-ui/core/styles'

const paletteDefault = {
  palette: {
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
  //console.log('THEME:')
  //console.log(theme)
  
  if (theme) {
    return createMuiTheme(theme)
  }

  return createMuiTheme(paletteDefault)
}