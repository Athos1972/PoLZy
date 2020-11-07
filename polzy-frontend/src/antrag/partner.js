import React, { useState } from 'react'
import { 
  TextField,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  RadioGroup,
  Radio,
  Grid
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import MuiAlert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { parse } from 'date-fns'
import { searchPartner } from '../api'


// Styles
const useStyles = makeStyles((theme) => ({
  partnerCard: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },

  flexContainerRight: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },

  flexContainerColumn: {
    display: "flex",
    flexDirection: "column"
  },

  flexContainerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  dialogItem: {
    marginTop: theme.spacing(1),
  },

}))

function InputText(props) {

  return (
    <FormControl
      variant="outlined"
      size="small"
      fullWidth
      required={props.required}
    >
      <InputLabel htmlFor={`${props.name}-${props.id}`}>
        {props.brief}
      </InputLabel>
      <OutlinedInput
        id={`${props.name}-${props.id}`}
        value={props.value}
        onChange={(e) => props.onChange(props.name, e.target.value)}
        label={props.brief}
      />
    </FormControl>
  )
}

function InputRadio(props) {
  const classes = useStyles()

  return (
    <FormControl
      component="fieldset"
      required={props.required}
    >
      <FormLabel component="legend">{props.brief}</FormLabel>
      <RadioGroup
        classes={{root: classes.flexContainerRow}}
        aria-label="gender"
        name="gender1"
        value={props.value}
        onChange={(e) => props.onChange(props.name, e.target.value)}
      >
        {props.options.map(opt => (
          <FormControlLabel
            key={opt}
            value={opt}
            control={<Radio />}
            label={opt}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

function CreatePartner(props) {
  const {t} = useTranslation("antrag", "partner")

  const initPartner = {
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    email: '',
    phone: '',
  }

  // state vars
  const [partner, setPartner] = useState({...initPartner})

  // options
  const genderOptions = [
    t("partner:gender.male"),
    t("partner:gender.female"),
    t("partner:gender.float"),
  ]

  const handleDataChange = (name, value) => {
    setPartner(preValues => ({
      ...preValues,
      [name]: value,
    }))
  }

  const handleCreateClick = () => {
    props.onClose()
    props.savePartner(partner)
    props.onCreate()
    setPartner({...initPartner})
  }

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
          <Grid item xs={12}>
            <InputText
              classes
              id={props.id}
              value={partner.firstName}
              onChange={handleDataChange}
              name="firstName"
              brief={t("partner:first.name")}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputText
              id={props.id}
              value={partner.lastName}
              onChange={handleDataChange}
              name="lastName"
              brief={t("partner:last.name")}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputRadio
              id={props.id}
              value={partner.gender}
              onChange={handleDataChange}
              options={genderOptions}
              name="gender"
              brief={t("partner:gender")}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputText
              classes
              id={props.id}
              value={partner.address}
              onChange={handleDataChange}
              name="address"
              brief={t("partner:address")}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputText
              classes
              id={props.id}
              value={partner.email}
              onChange={handleDataChange}
              name="email"
              brief={t("partner:email")}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputText
              classes
              id={props.id}
              value={partner.phone}
              onChange={handleDataChange}
              name="phone"
              brief={t("partner:phone")}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t("common:cancel")}
        </Button>
        <Button
          color="primary"
          onClick={handleCreateClick}
        >
          {t("common:create")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function SearchPartner(props) {
  const {t} = useTranslation("antrag")

  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

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

  const handleSelect = (event, newValue) => {
    console.log('SELECTED: ')
    console.log(newValue)
    if (newValue !== null) {
      props.savePartner(newValue)
      props.onSelect()
    }
  }

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    props.setShowToast(false)
  }

  return (
    <React.Fragment>
      <Tooltip
        title={props.data.tooltip}
        placement="top"
      >
        <Autocomplete
          id={`${props.data.name}-${props.id}`}
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
    </React.Fragment>
  )
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function PartnerCard(props) {
  const {t} = useTranslation("antrag")
  const classes = useStyles()

  const {data, ...baseProps} = props
  const searchFields = data.fields.filter(field => field.fieldDataType === "SearchEndPoint")
  const partnerField = searchFields.length > 0 ? searchFields[0] : null

  // state vars
  const [toastText, setToastText] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [showPartnerDialog, setShowPartnerDialog] = useState(false)

  const handleToastOpen = (text) => {
    setToastText(text)
    setShowToast(true)
  }

  const handleToastClose = () => {
    setShowToast(false)
  }

  const handlePartnerDialogOpen = () => {
    setShowPartnerDialog(true)
  }

  const handlePartnerDialogClose = () => {
    setShowPartnerDialog(false)
  }

  return (
    <React.Fragment>

      {/* Partner Card */}
      <Paper 
        classes={{root: classes.partnerCard}}
        elevation={2}
      >

        {/* Title */}
        <Typography 
          gutterBottom
          variant="h5"
          component="p"
        >
          {data.description}
        </Typography>

        {/* Partner Search Field */}
        {partnerField !== null &&
          <SearchPartner
            {...baseProps}
            data={partnerField}
            onSelect={() => handleToastOpen(t("antrag:partner.saved"))}
          />
        }
        <div className={classes.flexContainerRight} >
          <Button 
            onClick={handlePartnerDialogOpen}
            color="primary"
            variant="contained"
          >
            {t("antrag:partner.new")}
          </Button>
        </div>
      </Paper>

      {/* New Partner Dialog */}
      <CreatePartner
        {...baseProps}
        open={showPartnerDialog}
        onClose={handlePartnerDialogClose}
        onCreate={() => handleToastOpen(t("antrag:partner.created"))}
      />

      {/* Toast */}
      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
        >
          {toastText}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}