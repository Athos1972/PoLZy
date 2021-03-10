import React from 'react'
import { connect } from 'react-redux'
import { 
  TextField,
  CircularProgress,
  Popper,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { addValues } from '../redux/actions'
import { getValueList } from '../api/general'

/*
** Drop-down Select with Filter
*/

// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    paddingBottom: theme.spacing(2),
  },
}))


// popper component
const SelectPopper = (props) => {
  const styles = {
    popper: {
      width: "fit-content",
      minWidth: props.style.width,
    }
  }
  
  return (
    <Popper
      {...props}
      style={styles.popper}
      placement="bottom-start"
    />
  )
}
function getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}
function DataFieldSelect(props) {
  const classes = useStyles()
  const {t} = useTranslation('common')

  const {id, data, value } = props
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState({
    show: false,
    message: '',
  })

  React.useEffect(() => {
    // inputRange contains options
    if (data.inputRange.length === 0 || data.inputRange[0] !== "async") {
      setOptions(data.inputRange)
      return
    }

    // options should be fetched from backend
    const valueListName = data.inputRange[1]

    // options were already fetched
    if (props.valueLists[valueListName]) {
      setOptions(props.valueLists[valueListName])
      return
    }

    // call backend for options
    setLoading(true)
    setOptions([])
    getValueList(
      props.user,
      {
        'instanceId': id,
        'valueListName': valueListName,
      },
    ).then(data => {
      setOptions(data)
      props.addValues({
        name: valueListName,
        values: data,
      })
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      setLoading(false)
    })

  }, [data.inputRange])

  React.useEffect(() => {
    if (data.errorMessage) {
      setError({
        show: true,
        message: data.errorMessage,
      })
      return
    }

    if (data.isMandatory && options.length > 0 && !options.includes(value)) {
      setError({
        show: true,
        message: t('common:wrong.value'),
      })
      return
    }

    setError({
      show: false,
      message: '',
    })

  }, [options, value, data.errorMessage])

  React.useEffect(() => {
    setError(Boolean(data.errorMessage))
  }, [data.errorMessage])

  const handleChange = (event, newValue) => {
    const updateValue = {[data.name]: newValue}
    
    // update on input trigger
    console.log(getAllMethods(props))
    console.log(getAllMethods(data))
    if (data.inputTriggers) {
      props.onInputTrigger(updateValue)
    } else {
      // update antrag value
      props.onChange(updateValue)
    }
  }

  return (
    <Autocomplete
      classes={{root: classes.inputField}}
      id={`${data.name}`}
      value={Boolean(value) ? value : null}
      onChange={handleChange}
      options={options}
      PopperComponent={SelectPopper}
      fullWidth
      size="small"
      renderInput={(params) => 
        <TextField {...params}
          label={data.brief}
          variant="outlined"
          required={data.isMandatory}
          error={error.show}
          helperText={error.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading &&
                  <CircularProgress color="inherit" size={20} />
                }
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      }
    />
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  valueLists: state.valueLists,
})

const mapDispatchToProps = {
  addValues: addValues,
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFieldSelect)