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
import { SearchDropDown } from '../components/searchField'
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
                {t(option)/*capitalizeFirstChar(option)*/}
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
                {t(option)}
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
/*
    if (searchFor === "customer" && values.customer) {
      return true
    }
*/
    return false
  }

  const handleSubmit = () => {
    // add policy card
    props.addPolicy({
      request_state: "waiting",
      policy_number: values.number,
      effective_date: values.date,
    })

    // update state to default
    setValues(defaultData)
  }

  const handleCustomerSelect = (value) => {
    //console.log('Selected:')
    //console.log(value)

    // add customer card
    props.addPolicy({
      request_state: "customer",
      policies: [],
      ...value,
    })
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
          <Grid container spacing={2}>
            {searchFor === "policy" ? (
              <React.Fragment>
                <Grid item xs={11} md={4}>
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
                <Grid item xs={11} md={4}>
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
                <Grid item xs={11} md={3}>
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
              </React.Fragment>
            ) : (
              <Grid item xs={11}>
                <SearchDropDown
                  value={values.customer}
                  data={{
                    name: "customer",
                    brief: t("customer"),
                    endpoint: "partner",
                  }}
                  onChange={handleCustomerSelect}
                />
              </Grid>
            )}
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
