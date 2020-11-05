import React from 'react'
import { TextField, Tooltip, Snackbar } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import MuiAlert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from 'react-i18next'
import { searchPartner } from '../api'

export default function SearchPartner(props) {
  const {t} = useTranslation("antrag")

  const [value, setValue] = React.useState('')
  const [options, setOptions] = React.useState([])
  const [showToast, setShowToast] = React.useState(false)
  //const loading = value.length > 3 && options.length === 0
  const [loading, setLoading] = React.useState(false)

  //console.log('SEARCH PARTNER')
  //console.log(props)
/*
  React.useEffect(() => {
    setOptions([])
  }, [value])

  React.useEffect(() => {
    let active = true

    if (value.length < 3) {
      return undefined
    }

    (async () => {
      const response = await fetch(`/${props.stage}/search`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          activity: "partner",
          value: value,
        }),
      })
      const data = await response.json()

      if (active) {
        setOptions(data)
      }
    })()

    return () => {
      active = false
    }
  }, [loading, value])
*/
  const handleTextChange = (event, newValue, reason) => {
    setValue(newValue)

    if (reason !== "input" || newValue.length <= 3) {
      return
    }

    setLoading(true)

    // call backend
    searchPartner(props.stage, newValue).then(data => {
      setOptions(data)
      setLoading(false)
    })

  }

  const handleSelect = (event, v) => {
    console.log('SELECTED: ')
    console.log(v)
    if (v !== null) {
      props.onSelect(v.id)
      setShowToast(true)
    }
  }

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setShowToast(false)
  }

  return (
    <React.Fragment>
      <Tooltip
        title={props.data.tooltip}
        placement="top"
      >
        <Autocomplete
          id="partner-search-input"
          fullWidth
          size="small"
          getOptionSelected={(option, value) => option.label === value.label}
          getOptionLabel={(option) => option.label}
          filterOptions={(options) => options}
          inputValue={value}
          onInputChange={handleTextChange}
          onChange={handleSelect}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.data.brief}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Tooltip>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={handleToastClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleToastClose}
          severity="success"
        >
          {t("antrag:partner.saved")}
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  )
}