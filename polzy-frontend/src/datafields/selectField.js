import React from 'react'
import { 
  FormControl,
  FormHelperText,
  Tooltip,
  InputLabel,
  OutlinedInput,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'


/*
** Drop-down Select with Filter
*/
export default function DataFieldSelect(props) {
  const classes = useStyles()
  const {id, data, value } = props
  const [options, setOptions] = React.useState([])
  const [error, setError] = React.useState()

  React.useEffect(() => {
    if (data.inputRange !== "async") {
      setOptions(data.inputRange)
    }


  }, [])

  React.useEffect(() => {
    setError(Boolean(data.errorMessage))
  }, [data.errorMessage])

  const handleChange = (event, value) => {
    const newValue = {[data.name]: value}
    
    // update on input trigger
    if (data.inputTriggers) {
      props.onInputTrigger(newValue)
    } else {
      // update antrag value
      props.onChange(newValue)
    }
  }

  return (
    <Autocomplete
      classes={{root: classes.inputField}}
      id={`${data.name}-${id}`}
      value={value === "" ? null : value}
      onChange={handleChange}
      options={options}
      fullWidth
      size="small"
      renderInput={(params) => 
        <TextField {...params}
          label={data.brief}
          variant="outlined"
          required={data.isMandatory}
          error={error}
          helperText={data.errorMessage}
        />
      }
    />
  )
}