import { 
  Card,
  CardHeader,
  CardActions,
  CardContent,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

// Policy Cards Styles

/*

SPACING
*/
const themeSpacing = 1

/*

COLORS

*/
const activeColor = "#fff"
const errorColor = "#fbb"
const disabledColor = "#ccc"

/*

Hide Animations

*/
export const hideTime = 1000

// Active Card
export const CardActiveHide = withStyles((theme) => ({
  "@keyframes hideCard": {
    "0%": {
      opacity: 1,
      height: "168px",
      marginTop: theme.spacing(themeSpacing),
    },
    "75%": {
      opacity: 0,
      height: "10px",
      marginTop: "0px",
    },
    "100%": {
      opacity: 0,
      height: "0px",
      marginTop: "0px",
    },
  },

  root: {
    backgroundColor: activeColor,
    animation: `$hideCard ${hideTime}ms ${theme.transitions.easing.easeInOut}`,
  }
}))(Card)

// Error Card
export const CardErrorHide = withStyles((theme) => ({
  "@keyframes hideCard": {
    "0%": {
      opacity: 1,
      height: "128px",
      marginTop: theme.spacing(themeSpacing),
    },
    "75%": {
      opacity: 0,
      height: "10px",
      marginTop: "0px",
    },
    "100%": {
      opacity: 0,
      height: "0px",
      marginTop: "0px",
    },
  },

  root: {
    backgroundColor: errorColor,
    animation: `$hideCard ${hideTime}ms ${theme.transitions.easing.easeInOut}`,
  }
}))(Card)

/*

Static Cards

*/
export const CardActive = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(themeSpacing),
  }
}))(Card)

export const CardError = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(themeSpacing),
    backgroundColor: errorColor,
    color: "#b71c1c",
  },
}))(Card)

export const CardDisabled = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(themeSpacing),
    backgroundColor: disabledColor,
  },
}))(Card)

/*

Card Elements

*/ 
export const CardTop = withStyles((theme) => ({
  root: {
    paddingBottom: 0,
  },
}))(CardHeader)

export const CardMiddle = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingTop: 0,
  },
}))(CardContent)

export const CardBottom = withStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}))(CardActions)
