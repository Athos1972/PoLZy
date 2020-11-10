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
  Tooltip,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { DataFieldText, DataFieldDate } from './dataFields'
import { searchPortal } from '../api'


// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    paddingBottom: theme.spacing(2),
  },

  flexContainerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
}))

//const partnerFields = {}

/*
** Input Fields
*/

function SearchDropDown(props) {
  const {id, data} = props
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event, newValue, reason) => {

    if (reason === "clear") {
      //props.saveInstance('')
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
    const {label, ...otherValues} = newValue
    if (newValue !== null) {
      props.onChange({
        ...otherValues,
        [data.name]: label,
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

function InputRadio(props) {
  const classes = useStyles()

  return (
    <FormControl
      component="fieldset"
      required={props.data.isMandatory}
    >
      <FormLabel component="legend">{props.data.brief}</FormLabel>
      <RadioGroup
        classes={{root: classes.flexContainerRow}}
        aria-label="gender"
        name={props.data.name}
        value={props.value}
        onChange={(e) => props.onChange({[props.data.name]: e.target.value})}
      >
        {props.options.map((opt, index) => (
          <FormControlLabel
            key={index}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

function PartnerCreateField(props) {
  const {t} = useTranslation("partner")

  const genderOptions = [
    {
      value: 'm',
      label: t("partner:gender.male"),
    },
    {
      value: 'f',
      label: t("partner:gender.female"),
    },
    {
      value: '3',
      label: t("partner:gender.float")
    },
  ]

  switch (props.data.name) {
    case 'birthDate':
      return <DataFieldDate {...props} />
    case 'gender':
      return <InputRadio {...props} options={genderOptions} />
    case 'address':
      if (props.address) {
        return <DataFieldText {...props} value={props.address} />
      }

      return (
        <SearchDropDown
          {...props}
          data={{
            ...props.data,
            endpoint: "address"
          }}
          onChange={props.onSelect}
        />
      )
    default:
      return <DataFieldText {...props} />
  }
}


/*
** Dialogs
*/
function FindDialog(props) {
  const {t} = useTranslation("common", "antrag")

  return (
    <Dialog
      fullWidth
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={`find-${props.data.endpoint}-${props.id}`}
    >
      <DialogTitle id={`find-${props.data.endpoint}-${props.id}`}>
        {t("common:find") + " " + t(`antrag:${props.data.endpoint}`)}
      </DialogTitle>
      <DialogContent>
        <SearchDropDown {...props} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t("common:close")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


function NewDialog(props) {
  const {t} = useTranslation("common", "antrag", "partner")

  // initial values
  const initPartner = {
    firstName: '',
    lastName: '',
    birthDate: '01.01.2000',
    gender: '',
    address: props.address === undefined ? '' : props.address,
    email: '',
    telefon: '',
  }

  // state vars
  const [partner, setPartner] = useState({...initPartner})

  // address updater
  React.useEffect(() => {
    setPartner(prevPartner => ({
      ...prevPartner,
      address: props.address === undefined ? '' : props.address,
    }))
  }, [props.address])


  const handleDataChange = (newValues) => {
    //console.log('NEW DIALOG change')
    //console.log(newValues)
    setPartner(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const handleCreateClick = () => {
    const partnerLabelKeys = [
      'lastName',
      'firstName',
      'birthDate',
      'address',
    ]

    const partnerLabel = partnerLabelKeys.reduce((label, key) => 
      ([...label, partner[key]]), []
    ).join(' ')

    props.onChange({
      partnerNumber: '',
      ...partner,
      [props.data.name]: partnerLabel,
    })
    props.onClose()
  }
/*
  const handleAddressSelect = (newAddress) => {
    //console.log('Address Selected')
    setPartner(preValues => ({
      ...preValues,
      address: newAddress,
    }))
  }
*/
  const validateForm = () => {
    for (const prop in partner) {
      if (partner[prop] === '') {
        //console.log(prop + ": " + partner[prop])
        return false
      }
    }
    return true
  }

  //console.log("NEW DIALOG props:")
  //console.log(props)

  return (
    <Dialog 
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={`new-partner-title-${props.id}`}
    >
      <DialogTitle id={`new-partner-title-${props.id}`}>
        {t("antrag:partner.new")}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.keys(partner).map(key => (
            <Grid item xs={12} key={key}>
              <PartnerCreateField
                {...props}
                value={partner[key]}
                onChange={handleDataChange}
                onSelect={props.onChange}
                data={{
                  name: key,
                  brief: t(`partner:${key}`),
                  isMandatory: true
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t("common:cancel")}
        </Button>
        <Button
          color="primary"
          onClick={handleCreateClick}
          disabled={!validateForm()}
        >
          {t("common:create")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


export default function SearchField(props) {
  const {id, data, value } = props
  const {t} = useTranslation('common')
  const classes = useStyles()

  const [findOpen, setFindOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)

  const handleFindOpen = () => {
    setFindOpen(true)
  }

  const handleFindClose = () => {
    setFindOpen(false)
  }

  const handleNewOpen = () => {
    setNewOpen(true)
  }

  const handleNewClose = () => {
    setNewOpen(false)
  }

  //console.log('Search Field props:')
  //console.log(props)

  return (
    <React.Fragment>
      {data.endpoint === "partner" ? (
        <React.Fragment>
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
                  disabled={value === ""}
                  value={value}
                  endAdornment={value !== "" &&
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
                onClick={handleFindOpen}
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
                onClick={handleNewOpen}
                startIcon={<AccessibilityNewIcon />}
              >
                {t('common:new')}
              </Button>
            </Grid>
          </Grid>
          <FindDialog 
            {...props}
            open={findOpen}
            onClose={handleFindClose}
          />
          <NewDialog 
            {...props}
            open={newOpen}
            onClose={handleNewClose}
          />
        </React.Fragment>
      ) : (
        <Tooltip
          title={data.tooltip}
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