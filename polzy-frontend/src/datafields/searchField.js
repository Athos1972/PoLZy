import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  FormControl,
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
  Tabs,
  Tab,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import PersonIcon from '@material-ui/icons/Person'
import BusinessIcon from '@material-ui/icons/Business'
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { DataFieldText, DataFieldDate } from './generalFields'
import DataFieldSelect from './selectField'
import { searchPortal } from '../api/antrag'
import { validateSearchString } from '../utils'


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

  newDialogTitle: {
    paddingBottom: 0,
  },

  dialogTabs: {
    marginBottom: theme.spacing(2),
  },
}))

//const partnerFields = {}

/*
** Input Fields
*/

function SearchDropDownBase(props) {
  const {id, data} = props
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  const handleInputChange = (event, newValue, reason) => {

    if (reason === "clear") {
      //props.saveInstance('')
      return
    }

    if (reason !== "input" || !validateSearchString(newValue)) {
      return
    }

    setLoading(true)

    // call backend
    searchPortal(
      props.user,
      props.id,
      data.endpoint,
      newValue,
    ).then(data => {
      setOptions(data)
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      setLoading(false)
    })

  }

  const handleValueSelect = (event, newValues) => {
    if (newValues === null){
      return
    }

    //console.log(newValue)
/*
    const {label, ...otherValues} = newValue
    const updateValues = {
      ...otherValues,
      [data.name]: label,
    }
*/
    // update on input trigger
    if (data.inputTriggers) {
      props.onInputTrigger({[data.name]: newValues})
    } else {
      // update antrag value
      props.onChange({[data.name]: newValues})
    }
  }

  return (
    <Autocomplete
      classes={{root: classes.inputField}}
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
          required={data.isMandatory}
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
// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export const SearchDropDown = connect(mapStateToProps)(SearchDropDownBase)


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

  const handleClearClick = () => {
    props.onSelect({address: ""})
  }

  //console.log('Partner Create Field')
  //console.log(props)

  switch (props.data.name) {
    case 'birthDate':
      return <DataFieldDate {...props} />

    case 'gender':
      return <InputRadio {...props} options={genderOptions} />

    case 'addressDict':
      //console.log("Partner's Address Field:")
      //console.log(props)
      if (props.addressDict) {
        return (
          <DataFieldText
            {...props}
            value={props.addressDict.label}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleClearClick}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
          />
        )
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

    case 'companyType':
      if (props.companyTypes !== null) {
        return (
          <DataFieldSelect 
            {...props}
            data={{
              ...props.companyTypes,
              name: 'companyType',
              brief: (t('partner:companyType')),
              inputRange: props.companyTypes.inputRange,
            }}
          />
        )
      }

      return <DataFieldText {...props} />

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
        {t("antrag:partner.find")}
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
  const classes = useStyles()
  const {t} = useTranslation("common", "antrag", "partner")

  // initial values
  const initPartner = {
    person: {
      firstName: '',
      lastName: '',
      birthDate: '2000-01-01',
      gender: '',
      addressDict: null,
      email: '',
      telefon: '',
    },
    company: {
      companyName: '',
      registrationNumber: '',
      companyType: '',
      addressDict: null,
      email: '',
      telefon: '',
    },
  }

  // state vars
  const [partner, setPartner] = useState({...initPartner.person})
  const [partnerType, setPartnerType] = useState('person')

  // address updater
  const handleTabChange = (event, value) => {
    setPartner({...initPartner[value]})
    setPartnerType(value)
  }

  const handleDataChange = (newValues) => {
    //console.log('NEW DIALOG change')
    //console.log(newValues)
    setPartner(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const handleCreateClick = () => {
    const partnerLabelKeys = {
      person: [
        'lastName',
        'firstName',
        'birthDate',
        //'address',
      ],
      company: [
        'companyName',
        'companyType',
        'registrationNumber',
        //'address',
      ],
    }

    const partnerLabel = partnerLabelKeys[partnerType].reduce((label, key) => ([
      ...label,
      //typeof(partner[key]) === 'object' && partner[key].label ? partner[key].label : partner[key]
      partner[key],
    ]), []).join(' ') + (props.addressDict.label ? ' ' + props.addressDict.label : '')
 
    props.onChange({
      [props.data.name]: {
        ...partner,
        label: partnerLabel,
      }
    })
    props.onClose()
  }

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
      <DialogTitle
        classes={{root: classes.newDialogTitle}}
        id={`new-partner-title-${props.id}`}
      >
        {t("antrag:partner.new")}
      </DialogTitle>
      <DialogContent>
        <Tabs 
          classes={{root: classes.dialogTabs}}
          value={partnerType}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={t('partnet:person')}
            icon={<PersonIcon />}
            value="person"
            id="create-tab-person"
            aria-controls="tabpanel-person"
          />
          <Tab
            label={t('partner:company')}
            icon={<BusinessIcon />}
            value="company"
            id="create-tab-company"
            aria-controls="tabpanel-company"
          />
        </Tabs>
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
                  brief: t(`partner:${key === "addressDict" ? "address" : key}`),
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
  const {data, value } = props
  const {t} = useTranslation('common')

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

  const handleClearClick = () => {
    //console.log('CLEAR CLICKED')
    //console.log(props)
    props.onChange({[data.name]: null})
  }

  const getPartnerLabel = () => {
    return Object.keys()
  }

  //console.log(`Search Field '${data.name}' props:`)
  //console.log(props)

  return (
    <React.Fragment>
      {data.endpoint === "partner" ? (
        <React.Fragment>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={10}>
              <DataFieldText
                disabled={!Boolean(value)}
                data={data}
                value={value.label}
                endAdornment={Boolean(value) &&
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClearClick}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  }
              />
            </Grid>
            <Grid item xs={6} lg={1}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleFindOpen}
                startIcon={<SearchIcon fontSize="small" />}
              >
                {t('common:find')}
              </Button>
            </Grid>
            <Grid item xs={6} lg={1}>
              <Button
                variant="outlined"
                color="primary"
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