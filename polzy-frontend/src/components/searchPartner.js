import React from 'react'
import { TextField, Tooltip } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function SearchPartner(props) {
  const [value, setValue] = React.useState('')
  const [options, setOptions] = React.useState([])
  const loading = value.length > 3 && options.length === 0

  //console.log('SEARCH PARTNER')
  //console.log(props)

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

  const handleTextChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSelect = (event, v) => {
    console.log('SELECTED: ')
    console.log(v)
    if (v !== null) {
      props.onSelect(v.id)
    }
  }

  return (
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
            label="Search Partner"
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
  )
}