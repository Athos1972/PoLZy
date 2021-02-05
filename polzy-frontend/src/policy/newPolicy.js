import React from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  CardHeader,
  CardContent,
  Button,
  Typography,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { format } from 'date-fns'
import SearchIcon from '@material-ui/icons/Search'
import { useTranslation } from 'react-i18next'
import { CardNew, CardLogo } from '../styles/cards'
import { addPolicy } from '../redux/actions'
import { getCompanyLogo, EmblemLogo } from '../components/logo'
import { backendDateFormat } from '../dateFormat'
import { DataFieldText, DataFieldDate } from '../components/dataFields'
import { getCustomers } from '../api/policy'
//import { SearchDropDown } from '../components/searchField'
import { capitalizeFirstChar } from '../utils'
// styles
const useStyles = makeStyles(theme => ({
  noPaddingField: {
    padding: 0,
  }
}))

// bordless input field
const noBordersStyle = makeStyles((theme) => ({
  root: {
    padding: 0,
    "& $notchedOutline": {
      border: "none",
    },
    "&:hover $notchedOutline": {
      border: "none",
    },
    "&$focused $notchedOutline": {
      border: "none",
    }
  },
  focused: {},
  notchedOutline: {},
}))

// search options
const searchOptions = [
  "policy",
  "customer",
]

function NewPolicyHeader(props) {
  const {t} = useTranslation('policy')
  const classes = useStyles()
  const noBorders = noBordersStyle()

  const handleChange = (event) => {
    props.onChange(event.target.value)
  }

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography
          component="p"
          variant="h5"
        >
          {t('policy:find')}
        </Typography>
      </Grid>
      <Grid item>
        <FormControl
          variant="outlined"
          size="small"
        >
          <Select
            classes={{root: classes.noPaddingField}}
            value={props.value}
            onChange={handleChange}
            renderValue={option => (
              <Typography
                component="p"
                variant="h5"
              >
                {capitalizeFirstChar(option)}
              </Typography>
            )}
            input={
              <OutlinedInput
                classes={noBorders}
              />
            }
          >
            {props.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

function NewPolicy(props) {
  const defaultData = {
    number: '',
    date: format(new Date(), backendDateFormat),
    customer: '',
  }

  const [values, setValues] = React.useState(defaultData)
  //const [customerString, setCustomerString] = React.useState('')
  const [customerList, setCustomerList] = React.useState([])
  const [customerText, setCustomerText] = React.useState('')
  const [searchFor, setSearchFor] = React.useState(searchOptions[0])

  const {t} = useTranslation('policy')

  const handleInputChange = (newValues) => {
    setValues(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const validateForm = () => {
    if (searchFor === "policy" && values.number && values.date) {
      return true
    }

    if (searchFor === "customer" && values.customer) {
      return true
    }

    return false
  }

  const handleSubmit = () => {
    switch (searchFor) {
      case "policy":
        // add policy card
        props.addPolicy({
          request_state: "waiting",
          policy_number: values.number,
          effective_date: values.date,
        })

        // update state to default
        setValues(defaultData)
        return
      case "customer":
        getCustomers(props.user, values.customerString).then(data => {
          setCustomerList(data)
        }).catch(error => {
          console.log(error)
        })
        return
      default:
        return
    }
  }

  const handleCustomerSelect = (event, value) => {
    console.log(value)
  }

  return(
    <CardNew>
      <div style={{display: 'flex', flexDirection: 'column', flex: "1"}}>
        <CardHeader
          title={
            <NewPolicyHeader
              value={searchFor}
              options={searchOptions}
              onChange={setSearchFor}
            />
          }
        />
        <CardContent>
          <Grid container direction="column">
          <Grid container item spacing={2}>
            {searchFor === "policy" ? (
              <React.Fragment>
                <Grid item xs={12} md={3}>
                  <DataFieldText
                    id="policy-number"
                    value={values.number}
                    data={{
                      name: "number",
                      brief: t("policy.number")
                    }}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DataFieldDate
                    id="policy-date"
                    value={values.date}
                    data={{
                      name: "date",
                      brief: t("effective.date")
                    }}
                    onChange={handleInputChange}
                  />
                </Grid>
              </React.Fragment>
            ) : (
              <Grid item xs={12} md={6}>
                <DataFieldText
                  id="customer-serch"
                  value={values.customer}
                  data={{
                    name: "customer",
                    brief: t("policy.customer")
                  }}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SearchIcon />}
                onClick={handleSubmit}
                disabled={!validateForm()}
              >
                {t("find")}
              </Button>
            </Grid>
          </Grid>

          {/* Customer Seach Results */}
          {searchFor === "customer" &&
            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="customer-list"
                  options={customerList}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  size="small"
                  onChange={handleCustomerSelect}
                  renderInput={(params) => 
                    <TextField 
                      {...params}
                      label={t("policy:select.customer")}
                      variant="outlined"
                    />
                  }
                />
              </Grid>
            </Grid>
          }
          </Grid>
        </CardContent>
      </div>
      <div style={{width: 120}}>
      <CardLogo>
        <EmblemLogo
          logo={getCompanyLogo(props.user.company.attributes, "policy")}
          target="policy"
          size={170}
        />
      </CardLogo>
      </div>
    </CardNew>
  )
}


// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  addPolicy: addPolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPolicy)
