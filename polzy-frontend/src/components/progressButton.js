import React from 'react'
import { 
  Typography,
  FormControl,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format, parse } from 'date-fns'

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },

  button: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -theme.spacing(4) / 2,
    marginLeft: -theme.spacing(4) / 2,
  }
}))


/*
**  Button with progress 
*/
export default function ProgressButton(props) {
  const {title, loading, disabled, onClick } = props
  const classes = useStyles()

  return(
    <div className={classes.container}>
      <Button 
        variant="contained"
        color="primary"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {title}
      </Button>
      {loading && <CircularProgress size={24} className={classes.button} />}
    </div>
  )
}