import React, { useState } from 'react'
import {
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { searchPortal } from '../api'


// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    paddingBottom: theme.spacing(2),
  },

}))

const partnerFields = {}

/*
** Input Fields
*/

function SearchDropDown(props) {
  const {id, data} = props
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event, newValue, reason) => {

    if (reason === "clear") {
      props.saveInstance('')
      return
    }

    if (reason !== "input" || newValue.length <= 3) {
      return
    }

    setLoading(true)

    // call backend
    searchPortal(props.stage, data.endpoint, newValue).then(data => {
      setOptions(data)
      setLoading(false)
    })

  }

  const handleValueSelect = (event, newValue) => {
    if (newValue !== null) {
      props.onChange({
        ...newValue,
        [data.name]: 'X',
      })
    }
  }

  return (
    <Autocomplete
      id={`${data.name}-${id}`}
      fullWidth
      size="small"
      getOptionSelected={(option, value) => option.label === value.label}
      getOptionLabel={(option) => option.label}
      filterOptions={(options) => options}
      onInputChange={handleInputChange}
      onChange={handleValueSelect}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={data.brief}
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
  )
}

function FindDialog(props) {
  const {t} = useTranslation("common", "antrag", "partner")

  

  return (
    <Dialog 
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={`find-${props.endpoint}-${props.id}`}
    >
      <DialogTitle id={`find-${props.endpoint}-${props.id}`}>
        {t("common:find") + " " + t(`antrag:${props.endpoint}`)}
      </DialogTitle>
      <DialogContent>
        DIALOG
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t("common:cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function SearchField(props) {
  const {id, data, value, onChange } = props
  const {t} = useTranslation('common')
  const classes = useStyles()

  console.log('Search Field props:')
  console.log(props)

  return (
    <React.Fragment>
      {data.endpoint === "partner" ? (
        <Grid container spacing={1}>
          <Grid item xs={12} lg={10}>
            <FormControl
              classes={{root: classes.inputField}}
              variant="outlined"
              size="small"
              fullWidth
              required={data.isMandatory}
            >
              <InputLabel htmlFor={`${data.name}-${id}`}>
                {data.brief}
              </InputLabel>
              <OutlinedInput
                id={`${data.name}-${id}`}
                value={value}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
                label={data.brief}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} lg={1}>
            <Button
              variant="contained"
              color="default"
              fullWidth
              startIcon={<SearchIcon fontSize="small" />}
            >
              {t('common:find')}
            </Button>
          </Grid>
          <Grid item xs={6} lg={1}>
            <Button
              variant="contained"
              color="default"
              fullWidth
              startIcon={<AccessibilityNewIcon />}
            >
              {t('common:new')}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Tooltip
          title={partnerField.tooltip}
          placement="top"
        >
          <div>
            <SearchDropDown {...props} />
          </div>
        </Tooltip>
      )}
    </React.Fragment>
  )
}