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
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { format } from 'date-fns'
import SearchIcon from '@material-ui/icons/Search'
import { useTranslation } from 'react-i18next'
import { CardNew, CardLogo } from '../styles/cards'
import { addPolicy } from '../redux/actions'
import { getCompanyLogo, EmblemLogo } from '../components/logo'
import { backendDateFormat } from '../dateFormat'
import { DataFieldText, DataFieldDate } from '../components/dataFields'
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

  const searchOptions = [
    "policy",
    "customer",
  ]

  const [policy, setPolicy] = React.useState(defaultData)
  //const [customer, setCustomer] = React.useState()
  const [searchFor, setSearchFor] = React.useState(searchOptions[0])

  const {t} = useTranslation('policy')

  const handleInputChange = (newValues) => {
    //console.log('Value Changed:')
    //console.log(newValues)
    setPolicy(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const validateForm = () => {
    if (policy.number === "" || policy.date === "") {
      return false
    }

    return true
  }

  const handleSubmit = () => {
    // add policy card
    props.addPolicy({
      request_state: "waiting",
      policy_number: policy.number,
      effective_date: policy.date,
    })

    // update state to default
    setPolicy(defaultData)
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
          {searchFor === "policy" ? (
            <Grid container spacing={2}>
              <Grid item xs={11} md={3}>
                <DataFieldText
                  id="policy-number"
                  value={policy.number}
                  data={{
                    name: "number",
                    brief: t("policy.number")
                  }}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={11} md={3}>
                <DataFieldDate
                  id="policy-date"
                  value={policy.date}
                  data={{
                    name: "date",
                    brief: t("effective.date")
                  }}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={11} md={2}>
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
          ) : (
            <SearchDropDown
              data={{
                name: "customer",
                brief: "Customer data",
                endpoint: "partner",
              }}
              onChange={setPolicy}
            />
          )}
        </CardContent>
      </div>
      <div style={{width: 120}}>
      <CardLogo>
        <EmblemLogo
          logo={getCompanyLogo(props.companyAttributes, "policy")}
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
  companyAttributes: state.user.company.attributes,
})

const mapDispatchToProps = {
  addPolicy: addPolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPolicy)
