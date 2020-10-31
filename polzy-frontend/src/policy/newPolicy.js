import React from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format } from 'date-fns'
import SearchIcon from '@material-ui/icons/Search'
import { withTranslation } from 'react-i18next'
import { CardNew, CardLogo } from '../styles/cards'
import { addPolicy } from '../redux/actions'
import logo from '../logo/LEZYSEM5-02.png'


// Styles
const SearchButton = withStyles((theme) => ({
  root: {
    //backgroundColor: "#00c853",
    marginTop: theme.spacing(2),
    /*'&:hover': {
      backgroundColor: "#43a047",
    }*/
  },
}))(Button)


class NewPolicy extends React.Component {

  state = {
    policyNumber: '',
    effectiveDate: new Date(),
  }

  getLocale = () => {
    const { i18n } = this.props
    switch (i18n.language) {
      case 'en':
        return enLocale
      default:
        return deLocale
    }
  }

  handleNumberChange = event => {
    this.setState({
      policyNumber: event.target.value,
    })
  }

  handleDateChange = date => {
    this.setState({
      effectiveDate: date,
    })
  }

  handleSubmit = async () => {
    if (this.state.policyNumber) {
      // format date
      const effectiveDate = format(this.state.effectiveDate, "yyyy-MM-dd")
      // add policy card
      this.props.addPolicy({
        request_state: "waiting",
        policy_number: this.state.policyNumber,
        effective_date: effectiveDate,
      })
      // update state to default
      this.setState({
        policyNumber: '',
        effectiveDate: new Date(),
      })
    }
  }

  render() {
    const {t} = this.props

    return(
      <CardNew>
        <div style={{flex: '1 0 auto'}}>
          <CardHeader
            title={t("find.policy")}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="policy"
                  label={t("policy.number")}
                  size="small"
                  value={this.state.policyNumber}
                  onChange={this.handleNumberChange}
                />
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider 
                  utils={DateFnsUtils}
                  locale={this.getLocale()}
                >
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    margin="normal"
                    label={t("effective.date")}
                    format="yyyy-MM-dd"
                    size="small"
                    value={this.state.effectiveDate}
                    onChange={this.handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item>
                <SearchButton
                  variant="contained"
                  color="primary"
                  endIcon={<SearchIcon />}
                  onClick={this.handleSubmit}
                >
                  {t("find")}
                </SearchButton>
              </Grid>
            </Grid>
          </CardContent>
        </div>
        <CardLogo
          image={logo}
          title="LeZySEM"
        />
      </CardNew>
    )
  }
}

// translation
const TranslatedNewPolicy = withTranslation('policy')(NewPolicy)

// connect to redux store
export default connect(null, {addPolicy: addPolicy})(TranslatedNewPolicy)