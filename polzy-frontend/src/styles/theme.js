import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'


export const themeGreenOrange = createMuiTheme({
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
})